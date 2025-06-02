import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseException } from './error-response.exception';
import { ErrorEnum } from '../enums/error.enum';

// http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    let message = exception.message;
    let code = status;

    // 处理自定义异常
    if (exception instanceof ErrorResponseException) {
      code = exception.getErrorCode();
      message = exception.message;
    }
    // 处理 401 未授权错误
    else if (exception instanceof UnauthorizedException) {
      code = 401;
      message = ErrorEnum.ACCESS_TOKEN_EXPIRED.split(':')[1];
    } else if (exception instanceof ForbiddenException) {
      code = 403;
      message = ErrorEnum.FORBIDDEN.split(':')[1];
    } else if (exception instanceof NotFoundException) {
      code = 404;
      message = ErrorEnum.NOT_FOUND.split(':')[1];
    }
    // 处理其他错误
    else if (status === 500 && !(exception instanceof ErrorResponseException)) {
      // 生产环境下隐藏错误信息
      if (!(process.env.NODE_ENV === 'development'))
        message = ErrorEnum.SERVER_ERROR?.split(':')[1];
    }

    const resBody = {
      code,
      message,
      data: null,
    };

    response.status(200).send(resBody);
  }
}
