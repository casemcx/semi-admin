import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path?: string;
  details?: unknown;
}

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      catchError(err => {
        const timestamp = new Date().toISOString();
        const path: string | undefined = request?.url;

        if (err instanceof HttpException) {
          const statusCode = err.getStatus();
          const response = err.getResponse();
          const normalized =
            typeof response === 'string'
              ? { message: response }
              : ((response as Record<string, unknown> | undefined) ?? {});

          const { message: normalizedMessage, ...rest } = normalized;

          const payload: ErrorResponse = {
            success: false,
            statusCode,
            message:
              (normalizedMessage as string | string[] | undefined) ??
              err.message,
            error: err.name,
            timestamp,
            path,
          };

          if (Object.keys(rest).length > 0) {
            payload.details = rest;
          }

          return throwError(() => new HttpException(payload, statusCode));
        }

        const statusCode = 500;
        const payload: ErrorResponse = {
          success: false,
          statusCode,
          message: err?.message ?? 'Internal server error',
          error: err?.name ?? 'Error',
          timestamp,
          path,
        };

        return throwError(() => new HttpException(payload, statusCode));
      }),
    );
  }
}
