import { ApiProperty } from '@nestjs/swagger';

export class Album {
  @ApiProperty({
    description: 'Album unique identifier',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id: string;

  @ApiProperty({
    description: 'Album name',
    example: 'Innuendo'
  })
  name: string;

  @ApiProperty({
    description: 'Album release year',
    example: 1991
  })
  year: number;

  @ApiProperty({
    description: 'ID of the artist who created this album',
    format: 'uuid',
    nullable: true,
    required: false,
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  artistId: string | null;
}