import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from './dto/register.dto';
import { uploadOnCloudinary } from '@/utils/cloudinary';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async saveHashedRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }

  async register(dto: RegisterDto, file?: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    let profileImage;
    if (file) {
      profileImage = await uploadOnCloudinary(file.path);
    }

    console.log('avatar', profileImage);

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

      const { password, ...userWithoutPassword } = user;
      return {
        message: 'Recruiter registered successfully',
        user: userWithoutPassword,
      };
    }

    const user = await this.prisma.user.create({ data: userData });
    const { password, ...userWithoutPassword } = user;

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

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      }
    );

    await this.saveHashedRefreshToken(user.id, refreshToken);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    res.cookie('accessToken', accessToken, {
      ...options,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password, ...userWithoutPassword } = user;
    return {
      accessToken,
      user: userWithoutPassword,
      message: 'User logged in successfully',
    };
  }
}
