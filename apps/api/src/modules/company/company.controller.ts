import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { IResponseWithUser } from '@/interfaces';
import { ApiResponse } from '@/utils';

@ApiBearerAuth('access-token')
@ApiTags('Company')
@Controller('api/v1/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(AuthGuard('jwt-access'))
  @Post('create')
  async create(
    @Body() dto: CreateCompanyDto,
    @Request() req: IResponseWithUser,
    @Res() res: Response
  ) {
    const company = await this.companyService.create(dto, req.user);
    return new ApiResponse(201, company, 'Company created successfully');
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Get('all')
  async findAll() {
    const companies = await this.companyService.findAll();
    return new ApiResponse(200, companies, 'Companies fetched successfully');
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const company = await this.companyService.findOne(id);
    return new ApiResponse(200, company, 'Company fetched successfully');
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @Req() req: any
  ) {
    const updatedCompany = await this.companyService.update(id, dto, req.user);
    return new ApiResponse(200, updatedCompany, 'Company updated successfully');
  }

  @UseGuards(AuthGuard('jwt-access'))
  @Post(':id/assign-employee')
  async assignEmployee(
    @Param('id') companyId: string,
    @Body() dto: AssignEmployeeDto,
    @Req() req: any
  ) {
    const result = await this.companyService.assignEmployee(
      companyId,
      dto,
      req.user
    );
    return new ApiResponse(200, result, 'Employee assigned successfully');
  }
}
