import { IsOptional, IsString, IsNumber, IsUUID, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrackDto {
  @ApiProperty({
    description: 'The track name',
    example: 'Bohemian Rhapsody',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The ID of the artist who performed this track',
    format: 'uuid',
    required: false,
    nullable: true,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'artistId must be a valid UUID v4' })
  artistId?: string | null;

  @ApiProperty({
    description: 'The ID of the album this track belongs to',
    format: 'uuid',
    required: false,
    nullable: true,
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID('4', { message: 'albumId must be a valid UUID v4' })
  albumId?: string | null;

  @ApiProperty({
    description: 'Track duration in seconds',
    example: 355,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  duration?: number;
}
