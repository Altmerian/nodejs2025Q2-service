import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty({
    description: 'The artist name',
    example: 'Freddie Mercury',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Whether the artist has won a Grammy',
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
