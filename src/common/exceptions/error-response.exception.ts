import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorEnum } from 'src/common/enums/error.enum';

/**
 * @description：自定义响应异常
 */
export class ErrorResponseException extends HttpException {
  constructor(error: ErrorEnum | string) {
    const [code, message] = error.split(':');
    if (error.split(':').length === 2) {
      super(
        {
          code: Number(code),
          message: message,
        },
        HttpStatus.OK,
      );
      return;
    }

    super(
      {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
        timestamp: new Date().getTime(),
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
