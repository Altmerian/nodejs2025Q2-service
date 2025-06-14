import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { ReasonPhrases } from 'http-status-codes';
import { LoggingService } from '../../logging/logging.service';

@Injectable()
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();

      if (typeof responseBody === 'string') {
        message = responseBody;
        error = this.getErrorName(status);
      } else if (typeof responseBody === 'object' && responseBody !== null) {
        const responseObj = responseBody as any;
        message = responseObj.message || exception.message;
        error = responseObj.error || this.getErrorName(status);
      } else {
        message = exception.message;
        error = this.getErrorName(status);
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = ReasonPhrases.INTERNAL_SERVER_ERROR;
      error = ReasonPhrases.INTERNAL_SERVER_ERROR;
    }

    // Log the error
    const errorMessage = `${request.method} ${request.url} - ${status} ${error}: ${message}`;
    const context = 'HttpExceptionFilter';

    if (status >= 500) {
      // Log server errors as error level with stack trace
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.loggingService.error(errorMessage, context, stack);
    } else if (status >= 400) {
      // Log client errors as warn level
      this.loggingService.warn(errorMessage, context);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getErrorName(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ReasonPhrases.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return ReasonPhrases.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ReasonPhrases.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ReasonPhrases.NOT_FOUND;
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return ReasonPhrases.UNPROCESSABLE_ENTITY;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return ReasonPhrases.INTERNAL_SERVER_ERROR;
      default:
        return 'Error';
    }
  }
}
