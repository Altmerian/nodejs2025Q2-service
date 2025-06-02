import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty({
    description: 'The album name',
    example: 'Innuendo'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The album release year',
    example: 1991,
  })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty({
    description: 'The ID of the artist who created this album',
    format: 'uuid',
    required: false,
    nullable: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'artistId must be a valid UUID v4' })
  artistId?: string | null;
}