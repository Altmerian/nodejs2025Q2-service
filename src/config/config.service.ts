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
}
