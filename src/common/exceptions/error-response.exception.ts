import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorEnum } from 'src/common/enums/error.enum';

/**
 * @description：自定义响应异常
 */
export class ErrorResponseException extends HttpException {
  private errorCode: number;

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
      this.errorCode = HttpStatus.OK;
      return;
    }

    super(
      {
        code: HttpStatus.OK,
        message: error,
        timestamp: new Date().getTime(),
      },
      HttpStatus.OK,
    );
    this.errorCode = HttpStatus.OK;
  }
  getErrorCode(): number {
    return this.errorCode;
  }
}
