import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum Role {
  EMPLOYEE = 'EMPLOYEE',
  RECRUITER = 'RECRUITER',
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsString()
  companyName?: string; // only for recruiter
}
