import {
  CallHandler,
  ExecutionContext,
  // HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: unknown) => ({
        code: 200,
        message: 'success',
        data,
      })),
    );
  }
}
