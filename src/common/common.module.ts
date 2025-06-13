import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { PasswordService } from './services/password.service';

/**
 * Common module providing shared services and utilities
 * This module is marked as @Global to make its exports available
 * throughout the application without explicit imports
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [PasswordService],
  exports: [PasswordService],
})
export class CommonModule {}
