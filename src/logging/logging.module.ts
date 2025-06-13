import { Global, Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { RequestLoggingMiddleware } from './request-logging.middleware';
import { ResponseLoggingInterceptor } from './response-logging.interceptor';
import { ConfigModule } from '../config/config.module';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [LoggingService, RequestLoggingMiddleware, ResponseLoggingInterceptor],
  exports: [LoggingService, RequestLoggingMiddleware, ResponseLoggingInterceptor],
})
export class LoggingModule {}
