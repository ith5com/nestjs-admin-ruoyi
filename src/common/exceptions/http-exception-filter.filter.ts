import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
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
    if (status === 500 && !(exception instanceof ErrorResponseException)) {
      // 生产环境下隐藏错误信息
      if (!(process.env.NODE_ENV === 'development'))
        message = ErrorEnum.SERVER_ERROR?.split(':')[1];
    }

    const apiErrorCode =
      exception instanceof ErrorResponseException
        ? exception.getErrorCode()
        : status;
    console.log(exception instanceof ErrorResponseException);
    console.log('apiErrorCode', apiErrorCode);
    console.log('status', status);
    // 返回基础响应结果
    const resBody = {
      code: apiErrorCode,
      message,
      data: null,
    };

    response.status(status).send(resBody);
  }
}
