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
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/v1/user')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('profileImage', multerConfig))
  async register(@Body() dto: RegisterDto, @UploadedFile() file?: File) {
    return this.authService.register(dto, file);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.login(dto, res);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Post('logout')
  async logout(
    @Request() req: IResponseWithUser,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.logout(req, res);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh-token')
  async refreshAccessToken(
    @Request() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.refreshAccessToken(req, res);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Post('change-password')
  async changeCurrentPassword(
    @Request() req: IResponseWithUser,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.changeCurrentPasswordWithOldPassword(
      req,
      res
    );
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Get('profile')
  async getProfile(
    @Request() req: IResponseWithUser,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.getProfile(req, res);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Post('/update-profile')
  async updateProfile(
    @Request() req: IResponseWithUser,
    @Res({ passthrough: true }) res: Response
  ) {
    console.log('req.body', req.body);
    return await this.authService.updateProfile(req, res);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Post('/profile-image')
  @UseInterceptors(FileInterceptor('profileImage', multerConfig))
  async updateProfileImage(
    @Request() req: IResponseWithUser,
    @Res() res: Response
  ) {
    return await this.authService.updateProfileImage(req, res);
  }
}
