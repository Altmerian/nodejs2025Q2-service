import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "The user's login",
    example: 'TestUser',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    description: "The user's password",
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}