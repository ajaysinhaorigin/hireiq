import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import type { IResponseWithUser } from '@/interfaces';
import { multerConfig } from 'src/config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/v1/user')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('profileImage', multerConfig))
  async register(@Body() dto: RegisterDto, @UploadedFile() file?: File) {
    return this.authService.register(dto, file);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    return await this.authService.login(dto, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    return await this.authService.login(dto, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refresh-token')
  async refreshAccessToken(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: any
  ) {
    return await this.authService.login(dto, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  async changeCurrentPassword(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: any
  ) {
    return await this.authService.login(dto, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req: IResponseWithUser) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/update-profile')
  updateProfile(@Request() req: IResponseWithUser) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profileImage')
  updateProfileImage(@Request() req: IResponseWithUser) {
    return req.user;
  }
}
