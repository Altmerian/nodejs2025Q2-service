import { ApiProperty } from '@nestjs/swagger';

export class Favorites {
  @ApiProperty({
    description: 'List of favorite artist IDs',
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440000']
  })
  artists: string[];

  @ApiProperty({
    description: 'List of favorite album IDs',
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440001']
  })
  albums: string[];

  @ApiProperty({
    description: 'List of favorite track IDs',
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440002']
  })
  tracks: string[];
}