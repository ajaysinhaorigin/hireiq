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
import { AuthGuard } from '@nestjs/passport';
import type { IResponseWithUser } from '@/interfaces';
import { multerConfig } from 'src/config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterRequestDto,
  UpdateProfileDto,
  UpdateProfileImageDto,
} from './dto/auth.dto';

@ApiTags('Auth')
@ApiBearerAuth('access-token')
@Controller('api/v1/user')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: RegisterRequestDto,
  })
  @UseInterceptors(FileInterceptor('profileImage', multerConfig))
  async register(@Body() dto: RegisterRequestDto, @UploadedFile() file?: File) {
    console.log('Register DTO:', dto, 'File:', file);
    return await this.authService.register(dto, file);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    return await this.authService.login(dto, res);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Post('logout')
  async logout(@Request() req: IResponseWithUser, @Res() res: Response) {
    return await this.authService.logout(req, res);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh-token')
  async refreshAccessToken(@Request() req: Request, @Res() res: Response) {
    return await this.authService.refreshAccessToken(req, res);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Post('change-password')
  async changeCurrentPassword(
    @Request() req: Request,
    @Body() dto: ChangePasswordDto,
    @Res() res: Response
  ) {
    return await this.authService.changeCurrentPasswordWithOldPassword(
      req,
      dto,
      res
    );
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Get('profile')
  async getProfile(@Request() req: IResponseWithUser, @Res() res: Response) {
    return await this.authService.getProfile(req, res);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Post('/update-profile')
  async updateProfile(
    @Request() req: Request,
    @Body() dto: UpdateProfileDto,
    @Res() res: Response
  ) {
    return await this.authService.updateProfile(req, dto, res);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Post('/profile-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProfileImageDto })
  @UseInterceptors(FileInterceptor('profileImage', multerConfig))
  async updateProfileImage(
    @Request() req: IResponseWithUser,
    @UploadedFile() file: File,
    @Res() res: Response
  ) {
    return await this.authService.updateProfileImage(req, file, res);
  }
}
