import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({
    description: 'User login name',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
