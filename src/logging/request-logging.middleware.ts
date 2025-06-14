import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl: url, query, body } = req;
    const userAgent = req.get('user-agent') || '';

    const message = `${method} ${url}`;
    const context = 'HTTP Request';

    const logDetails = {
      method,
      url,
      query: Object.keys(query).length > 0 ? query : undefined,
      body: body && Object.keys(body).length > 0 ? body : undefined,
      userAgent: userAgent.substring(0, 100),
    };

    const filteredDetails = Object.entries(logDetails)
      .filter(([, value]) => value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    this.loggingService.log(`${message} - ${JSON.stringify(filteredDetails)}`, context);

    next();
  }
}
