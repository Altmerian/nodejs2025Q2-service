import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    description: "The user's old password",
    example: 'oldPassword123',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: "The user's new password",
    example: 'newPassword123',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
