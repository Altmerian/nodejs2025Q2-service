import { ApiProperty } from '@nestjs/swagger';

export class Track {
  @ApiProperty({
    description: 'Track unique identifier',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Track name',
    example: 'The Show Must Go On',
  })
  name: string;

  @ApiProperty({
    description: 'ID of the artist who performed this track',
    format: 'uuid',
    nullable: true,
    required: false,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  artistId: string | null;

  @ApiProperty({
    description: 'ID of the album this track belongs to',
    format: 'uuid',
    nullable: true,
    required: false,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  albumId: string | null;

  @ApiProperty({
    description: 'Track duration in seconds',
    example: 262,
  })
  duration: number;
}
