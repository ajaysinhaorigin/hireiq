import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { deleteFromCloudinary, uploadOnCloudinary } from '@/utils/cloudinary';
import { IResponseWithUser } from '@/interfaces';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  RegisterRequestDto,
  Role,
  UpdateProfileDto,
  UpdateProfileImageDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async generateAccessAndRefreshToken(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(
      { id: user.id },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      }
    );

    return { accessToken, refreshToken };
  }

  async saveHashedRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }

  async register(dto: RegisterRequestDto, file?: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    let profileImage;
    if (file) {
      profileImage = await uploadOnCloudinary(file.path);
    }

    const userData: any = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
      profileImage: profileImage?.url || '',
    };

    if (dto.role === Role.RECRUITER && dto.companyName) {
      const company = await this.prisma.company.create({
        data: { name: dto.companyName },
      });

      userData.recruiterFor = { connect: { id: company.id } };

      const user = await this.prisma.user.create({ data: userData });

      await this.prisma.company.update({
        where: { id: company.id },
        data: { recruiterId: user.id },
      });

      const { password, refreshToken, ...userWithoutPassword } = user;
      return {
        message: 'Recruiter registered successfully',
        user: userWithoutPassword,
      };
    }

    const user = await this.prisma.user.create({ data: userData });
    const { password, refreshToken, ...userWithoutPassword } = user;

    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
  }

  async login(dto: LoginDto, res: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateAccessAndRefreshToken(user);

    await this.saveHashedRefreshToken(user.id, newRefreshToken);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    const { password, refreshToken, ...userWithoutPassword } = user;

    return res
      .status(200)
      .cookie('accessToken', accessToken, {
        ...options,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .cookie('refreshToken', newRefreshToken, {
        ...options,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        accessToken,
        refreshToken: newRefreshToken,
        user: userWithoutPassword,
        message: 'User logged in successfully',
      });
  }

  async logout(request: IResponseWithUser, res: any) {
    try {
      await this.prisma.user.update({
        where: { id: request.user.id },
        data: { refreshToken: null },
      });

      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      };

      return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json({
          data: {},
          success: true,
          status: 200,
          message: 'User logged out successfully',
        });
    } catch (error) {
      console.error('Logout error:', error);
      return res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  }

  async refreshAccessToken(request: any, res: any) {
    const incomingRefreshToken =
      (await request.cookies.refreshToken) || request.body.refreshToken;

    if (!incomingRefreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    try {
      const decoded = this.jwtService.verify(incomingRefreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isTokenValid = await bcrypt.compare(
        incomingRefreshToken,
        user.refreshToken || ''
      );

      if (!isTokenValid) {
        throw new UnauthorizedException(
          'Refresh token is expired or already used'
        );
      }

      const { accessToken, refreshToken } =
        await this.generateAccessAndRefreshToken(user);

      await this.saveHashedRefreshToken(user.id, refreshToken);

      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      };

      return res
        .status(200)
        .cookie('accessToken', accessToken, {
          ...options,
          maxAge: 1 * 24 * 60 * 60 * 1000,
        })
        .cookie('refreshToken', refreshToken, {
          ...options,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
          status: 200,
          data: {
            accessToken,
            refreshToken,
          },
          message: 'Access token refreshed',
        });
    } catch (error) {
      console.error('Invalid refresh token', error);
      return res
        .status(500)
        .json({ message: 'Invalid refresh token', error: error.message });
    }
  }

  async changeCurrentPasswordWithOldPassword(
    req,
    dto: ChangePasswordDto,
    res: any
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { oldPassword, newPassword } = dto;
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      return res
        .status(500)
        .json({ message: 'Error changing password', error: error.message });
    }
  }

  async getProfile(req: IResponseWithUser, res: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const { password, refreshToken, ...safeUser } = user;

      return res.status(200).json({
        data: safeUser,
        message: 'Profile fetched successfully',
        success: true,
        status: 200,
      });
    } catch (error) {
      console.error('Error getting profile:', error);
      return res
        .status(500)
        .json({ message: 'Error getting profile', error: error.message });
    }
  }

  async updateProfile(req, dto: UpdateProfileDto, res: any) {
    try {
      const user = await this.prisma.user.update({
        where: { id: req.user.id },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.email && { email: dto.email }),
          ...(dto.bio && { email: dto.bio }),
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { password, refreshToken, ...safeUser } = user;
      return res.status(200).json({
        data: safeUser,
        message: 'Profile updated successfully',
        success: true,
        status: 200,
      });
    } catch (error) {
      console.error('Error getting profile:', error);
      return res
        .status(500)
        .json({ message: 'Error getting profile', error: error.message });
    }
  }

  async updateProfileImage(req, file: any, res: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      let profileImage;
      if (file) {
        profileImage = await uploadOnCloudinary(file.path);
      }

      let updatedUser = user;

      if (profileImage) {
        await deleteFromCloudinary(user.profileImage);

        updatedUser = await this.prisma.user.update({
          where: { id: user.id },
          data: { profileImage: profileImage.url },
        });
      }

      const { password, refreshToken, ...safeUser } = updatedUser;

      return res.status(200).json({
        data: safeUser,
        message: 'Profile image updated successfully',
        success: true,
        status: 200,
      });
    } catch (error) {
      console.error('Error while updating profile image', error);
      return res.status(500).json({
        message: 'Error while updating profile image',
        error: error.message,
      });
    }
  }
}
