import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('hello')
  getHello2(): string {
    return JSON.stringify({
      message: this.appService.getHello2(),
      date: new Date(),
      success: true,
    });
  }
}
