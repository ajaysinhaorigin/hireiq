import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AssignEmployeeDto } from './dto/assign-employee.dto';
import { IJwtPayload } from '@/interfaces';
import { Role } from '@/enum';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCompanyDto, user: IJwtPayload, res: any) {
    if (user.role !== Role.RECRUITER) {
      throw new ForbiddenException('Only recruiters can create companies');
    }

    // 1. Does recruiter already have a company?
    const existingCompany = await this.prisma.company.findFirst({
      where: { recruiterId: user.id },
    });

    if (existingCompany) {
      throw new BadRequestException('You already created a company.');
    }

    // 2. Check if the handle is unique
    const existingHandle = await this.prisma.company.findUnique({
      where: { handle: dto.handle },
    });

    if (existingHandle) {
      throw new BadRequestException('This username/handle is already taken.');
    }

    // 3. Create company
    const company = await this.prisma.company.create({
      data: {
        name: dto.name,
        handle: dto.handle, // Save user-provided handle
        website: dto.website,
        description: dto.description,
        location: dto.location,
        recruiter: { connect: { id: user.id } },
      },
    });

    return res.status(200).json({
      data: company,
      success: true,
      status: 200,
      message: 'Company created successfully',
    });
  }
  async findAll() {}
  async findOne(id: string) {}
  async update(id: string, dto: UpdateCompanyDto, req: any) {}
  async assignEmployee(companyId: string, dto: AssignEmployeeDto, req: any) {}
}
