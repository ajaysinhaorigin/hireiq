// src/auth/auth.service.ts
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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const userData: any = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
    };

    // If recruiter, create a company
    if (dto.role === Role.RECRUITER && dto.companyName) {
      const company = await this.prisma.company.create({
        data: {
          name: dto.companyName,
        },
      });

      userData.recruiterFor = { connect: { id: company.id } };

      // update company recruiter after user is created
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

    // Normal user registration
    const user = await this.prisma.user.create({ data: userData });
    const { password, ...userWithoutPassword } = user;
    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'secretkey',
      expiresIn: '7d',
    });

    const { password, ...userWithoutPassword } = user;
    return { accessToken, user: userWithoutPassword };
  }
}
