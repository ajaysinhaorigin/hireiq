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
import { ApiError } from '@/utils';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCompanyDto, user: IJwtPayload) {
    if (user.role !== Role.RECRUITER) {
      throw new ForbiddenException('Only recruiters can create companies');
    }

    const existingCompany = await this.prisma.company.findFirst({
      where: { recruiterId: user.id },
    });

    if (existingCompany) {
      throw new BadRequestException('You already created a company.');
    }

    const existingHandle = await this.prisma.company.findUnique({
      where: { handle: dto.handle },
    });

    if (existingHandle) {
      throw new BadRequestException('This username/handle is already taken.');
    }

    return await this.prisma.company.create({
      data: {
        name: dto.name,
        handle: dto.handle,
        website: dto.website,
        description: dto.description,
        location: dto.location,
        recruiter: { connect: { id: user.id } },
      },
    });
  }

  async findAll() {
    return await this.prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        handle: true,
        website: true,
        description: true,
        location: true,
        recruiterId: true,
        createdAt: true,
        _count: {
          select: { jobs: true, employees: true },
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.company.findUnique({
      where: { id },
      include: {
        recruiter: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { jobs: true, employees: true },
        },
      },
    });
  }
  async update(id: string, dto: UpdateCompanyDto, user: IJwtPayload) {
    // 1️⃣ Ensure company exists
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new ApiError(404, 'Company not found');

    // 2️⃣ Ensure user is the recruiter of this company
    if (company.recruiterId !== user.id) {
      throw new ApiError(403, 'You are not allowed to update this company');
    }

    // 3️⃣ If handle is changing — enforce uniqueness
    if (dto.handle && dto.handle !== company.handle) {
      const existingHandle = await this.prisma.company.findUnique({
        where: { handle: dto.handle },
      });

      if (existingHandle) {
        throw new ApiError(400, 'This handle is already taken');
      }
    }

    // 4️⃣ Update company
    return await this.prisma.company.update({
      where: { id },
      data: {
        name: dto.name ?? company.name,
        handle: dto.handle ?? company.handle,
        website: dto.website ?? company.website,
        description: dto.description ?? company.description,
        location: dto.location ?? company.location,
      },
    });
  }

  async assignEmployee(
    companyId: string,
    dto: AssignEmployeeDto,
    user: IJwtPayload
  ) {
    // 1️⃣ Validate company exists
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new ApiError(404, 'Company not found');
    }

    // 2️⃣ Only recruiter of the company can assign employees
    if (company.recruiterId !== user.id) {
      throw new ApiError(403, 'You are not allowed to manage this company');
    }

    // 3️⃣ Check if employee exists
    const employee = await this.prisma.user.findUnique({
      where: { id: dto.employeeId },
      select: { id: true, name: true, role: true, companyId: true },
    });

    if (!employee) {
      throw new ApiError(404, 'Employee not found');
    }

    // 4️⃣ Validate employee role
    if (employee.role !== 'EMPLOYEE') {
      throw new ApiError(400, 'Only EMPLOYEEs can be assigned to a company');
    }

    // 5️⃣ Check if employee already belongs to a company
    if (employee.companyId) {
      throw new ApiError(400, 'Employee is already assigned to a company');
    }

    // 6️⃣ Assign employee by connecting user → company
    const updatedEmployee = await this.prisma.user.update({
      where: { id: dto.employeeId },
      data: {
        company: { connect: { id: companyId } },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
      },
    });

    // 7️⃣ Return result
    return {
      companyId,
      employee: updatedEmployee,
    };
  }
}
