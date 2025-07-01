import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TransformedResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
  path: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, TransformedResponse<T> | T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<TransformedResponse<T> | T> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        if (response.statusCode === 204) {
          return data;
        }
        if (response.statusCode >= 200 && response.statusCode < 300) {
          return {
            data,
            statusCode: response.statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
          };
        }

        return data;
      }),
    );
  }
}
