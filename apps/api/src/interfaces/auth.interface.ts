import { Request } from '@nestjs/common';
export interface IResponseWithUser extends Request {
  user: any;
}
