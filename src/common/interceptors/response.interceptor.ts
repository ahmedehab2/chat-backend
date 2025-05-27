import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getReasonPhrase } from 'http-status-codes';
import { instanceToPlain } from 'class-transformer';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const isGraphQL = context.getType().toString() === 'graphql';

    if (isGraphQL) {
      return next.handle();
    }
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((originalData: any) => {
        if (response.headersSent) return originalData;

        if (
          originalData &&
          originalData.code &&
          originalData.message &&
          'data' in originalData
        ) {
          return originalData;
        }

        const statusCode: number = response.statusCode;
        const message: string = getReasonPhrase(statusCode);

        return {
          code: statusCode,
          message: message,
          data: instanceToPlain(originalData) || null,
        };
      }),
    );
  }
}
