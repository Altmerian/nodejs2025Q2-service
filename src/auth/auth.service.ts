import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { UserService } from '../user/services/user.service';
import { PasswordService } from '../common/services/password.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: AuthCredentialsDto): Promise<{ message: string }> {
    this.logger.log(`Creating new user account for login: ${signupDto.login}`);

    // UserService already handles password hashing
    await this.userService.create({
      login: signupDto.login,
      password: signupDto.password,
    });

    this.logger.log(`User account created successfully for login: ${signupDto.login}`);
    return { message: 'User created successfully' };
  }

  async login(loginDto: AuthCredentialsDto): Promise<AuthResponseDto> {
    this.logger.log(`Login attempt for user: ${loginDto.login}`);

    // Find user by login
    const users = await this.userService.findAll();
    const user = users.find((u) => u.login === loginDto.login);

    if (!user) {
      this.logger.warn(`Login failed: User not found for login: ${loginDto.login}`);
      throw new ForbiddenException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.passwordService.verifyPassword(loginDto.password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password for user: ${loginDto.login}`);
      throw new ForbiddenException('Invalid credentials');
    }

    this.logger.log(`Login successful for user: ${loginDto.login}`);
    return this.generateTokens(user);
  }

  async refresh(refreshDto: RefreshDto): Promise<AuthResponseDto> {
    this.logger.log('Processing refresh token request');

    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshDto.refreshToken, {
        secret: this.configService.jwtSecretRefreshKey,
      });

      // Find user to ensure they still exist
      const user = await this.userService.findById(payload.userId);
      if (!user) {
        this.logger.warn(`Refresh failed: User not found for ID: ${payload.userId}`);
        throw new ForbiddenException('Invalid refresh token');
      }

      this.logger.log(`Refresh token validated for user: ${user.login}`);
      return this.generateTokens(user);
    } catch (error) {
      this.logger.warn('Refresh token validation failed');
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new ForbiddenException('Invalid or expired refresh token');
      }
      throw error;
    }
  }

  private generateTokens(user: User): AuthResponseDto {
    const payload = {
      userId: user.id,
      login: user.login,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.jwtSecretKey,
      expiresIn: this.configService.tokenExpireTime,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.jwtSecretRefreshKey,
      expiresIn: this.configService.tokenRefreshExpireTime,
    });

    this.logger.log(`Generated tokens for user: ${user.login}`);

    return {
      accessToken,
      refreshToken,
    };
  }
}
