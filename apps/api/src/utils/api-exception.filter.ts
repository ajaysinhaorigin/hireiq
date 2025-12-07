import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiError } from './ApiError';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    // 1️⃣ Custom ApiError thrown by you
    if (exception instanceof ApiError) {
      return res.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        message: exception.message,
        data: null,
        success: false,
        errors: exception.errors,
      });
    }

    // 2️⃣ AuthGuard Unauthorized errors (missing or invalid token)
    if (exception instanceof UnauthorizedException) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Authentication token missing or invalid',
        data: null,
        success: false,
        errors: [],
      });
    }

    // 3️⃣ Forbidden (valid token, but wrong role)
    if (exception instanceof ForbiddenException) {
      return res.status(403).json({
        statusCode: 403,
        message: 'You do not have permission to access this resource',
        data: null,
        success: false,
        errors: [],
      });
    }

    // 4️⃣ Other NestJS errors (BadRequest, etc.)
    if (exception instanceof HttpException) {
      const response: any = exception.getResponse();
      return res.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: response.message || exception.message,
        data: null,
        success: false,
        errors: response.errors || [],
      });
    }

    // 5️⃣ Unknown 500 errors
    return res.status(500).json({
      statusCode: 500,
      message: exception.message || 'Internal Server Error',
      data: null,
      success: false,
      errors: [],
    });
  }
}
