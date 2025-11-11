import { Module } from '@nestjs/common';
import PrismaModule from './prisma/prisma.module';
import { UsersModule } from './modules';

@Module({
  imports: [PrismaModule, UsersModule],
})
export class AppModule {}
