import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingService } from './logging/logging.service';
import { ResponseLoggingInterceptor } from './logging/response-logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const loggingService = app.get(LoggingService);
  const port = configService.port;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter(loggingService));

  // Register global interceptor for response logging
  app.useGlobalInterceptors(new ResponseLoggingInterceptor(loggingService));

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(port);

  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    loggingService.fatal(`Uncaught Exception: ${error.message}`, 'Bootstrap', error.stack);
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    const errorMessage = reason instanceof Error ? reason.message : String(reason);
    const errorStack = reason instanceof Error ? reason.stack : undefined;
    loggingService.fatal(`Unhandled Rejection at: ${promise}, reason: ${errorMessage}`, 'Bootstrap', errorStack);
    process.exit(1);
  });
}
bootstrap();
