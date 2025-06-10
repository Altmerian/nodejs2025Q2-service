import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class PasswordService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Hash a plain text password using bcrypt
   * @param password - Plain text password to hash
   * @returns Promise with hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.cryptSalt;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify a plain text password against a hash
   * @param password - Plain text password to verify
   * @param hashedPassword - Hashed password to compare against
   * @returns Promise with boolean indicating if password matches
   */
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
