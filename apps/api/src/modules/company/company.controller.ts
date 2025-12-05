import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@ApiTags('Company')
@Controller('api/v1/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(AuthGuard('jwt-access'))
  @Post('create')
  async create(
    @Body() dto: CreateCompanyDto,
    @Req() req: any,
    @Res() res: Response
  ) {
    return await this.companyService.create(dto, req.user, res);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @Req() req: any
  ) {
    const user = req.user;
    return this.companyService.update(id, dto, user);
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Post(':id/assign-employee')
  assignEmployee(
    @Param('id') companyId: string,
    @Body() dto: AssignEmployeeDto,
    @Req() req: any
  ) {
    const user = req.user;
    return this.companyService.assignEmployee(companyId, dto, user);
  }
}
