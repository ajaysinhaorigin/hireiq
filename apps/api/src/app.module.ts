import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './config/multer.config';
import PrismaModule from './prisma/prisma.module';
import { AuthModule } from './modules';

@Module({
  imports: [MulterModule.register(multerConfig), PrismaModule, AuthModule],
})
export class AppModule {}
