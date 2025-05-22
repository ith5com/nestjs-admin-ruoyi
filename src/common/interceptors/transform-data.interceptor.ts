import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ErrorResponseException } from '../exceptions/error-response.exception';

@Injectable()
export class TransformDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: unknown) => ({
        code: 200,
        message: 'success',
        data,
      })),
      catchError((error) => {
        console.log(error);
        const message = error instanceof Error ? error.message : '未知错误';
        if (error instanceof HttpException) {
          return throwError(() => error);
        }
        return throwError(() => new ErrorResponseException(message));
      }),
    );
  }
}
