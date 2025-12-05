import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async create(dto: any, user) {
    // Implementation here
    console.log('Creating company with data:', dto, 'for user:', user);
    // const company = await this.prisma.company.create({
    //   data: {
    //     name: dto.name,
    //     website: dto.website,
    //     description: dto.description,
    //     location: dto.location,
    //     employees: {
    //       connect: { id: user.id },
    //     },
    //   },
    // });

    const res = await Promise.resolve();
    return { message: 'Company created successfully' };
  }
  async findAll() {}
  async findOne(id: string) {}
  async update(id: string, dto: UpdateCompanyDto, req: any) {}
  async assignEmployee(companyId: string, dto: AssignEmployeeDto, req: any) {}
}
