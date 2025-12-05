import { Request } from '@nestjs/common';
export interface IResponseWithUser extends Request {
  user: any;
}

export interface IJwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}
