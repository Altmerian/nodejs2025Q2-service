import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'User signup', description: 'Create a new user account' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data (missing login or password, or they are not strings)',
  })
  async signup(@Body() signupDto: AuthCredentialsDto): Promise<UserResponseDto> {
    return this.authService.signup(signupDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login', description: 'Authenticate user and get access/refresh tokens' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data (missing login or password, or they are not strings)',
  })
  @ApiForbiddenResponse({
    description: 'Authentication failed (user not found or password mismatch)',
  })
  async login(@Body() loginDto: AuthCredentialsDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens', description: 'Get new access and refresh tokens using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token (missing refreshToken in body)',
  })
  @ApiForbiddenResponse({
    description: 'Authentication failed (refresh token is invalid or expired)',
  })
  async refresh(@Body() refreshDto: RefreshDto): Promise<AuthResponseDto> {
    // Per requirements: return 401 if refreshToken is missing (not 400 from validation)
    if (!refreshDto.refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }
    return this.authService.refresh(refreshDto);
  }
}
