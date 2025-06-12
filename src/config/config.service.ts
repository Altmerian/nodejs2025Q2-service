import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get port(): number {
    return this.configService.getOrThrow<number>('port');
  }

  get cryptSalt(): number {
    return this.configService.getOrThrow<number>('cryptSalt');
  }

  get databaseUrl(): string {
    return this.configService.getOrThrow<string>('database.url');
  }

  get databaseHost(): string {
    return this.configService.getOrThrow<string>('database.host');
  }

  get databasePort(): number {
    return this.configService.getOrThrow<number>('database.port');
  }

  get databaseUsername(): string {
    return this.configService.getOrThrow<string>('database.username');
  }

  get databasePassword(): string {
    return this.configService.getOrThrow<string>('database.password');
  }

  get databaseName(): string {
    return this.configService.getOrThrow<string>('database.database');
  }

  get nodeEnv(): string {
    return this.configService.getOrThrow<string>('nodeEnv');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get logLevel(): string {
    return this.configService.getOrThrow<string>('logging.level');
  }

  get logDir(): string {
    return this.configService.getOrThrow<string>('logging.dir');
  }

  get logMaxSizeKb(): number {
    return this.configService.getOrThrow<number>('logging.maxSizeKb');
  }
}
