import { ApiProperty } from '@nestjs/swagger';

export class Artist {
  @ApiProperty({
    description: 'Artist unique identifier',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  id: string;

  @ApiProperty({
    description: 'Artist name',
    example: 'Freddie Mercury'
  })
  name: string;

  @ApiProperty({
    description: 'Whether the artist has won a Grammy award',
    example: false
  })
  grammy: boolean;
}