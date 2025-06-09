import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateArtistDto {
  @ApiProperty({
    description: 'The artist name',
    example: 'Freddie Mercury',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Whether the artist has won a Grammy',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  grammy?: boolean;
}
