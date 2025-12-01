import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { AccessTokenStrategy } from '../auth/jwt-access.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [CompanyService, PrismaService, AccessTokenStrategy],
  controllers: [CompanyController],
})
export default class CompanyModule {}
