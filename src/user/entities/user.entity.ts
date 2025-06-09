import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    description: 'User unique identifier',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'User login name',
    example: 'TestUser',
  })
  login: string;

  @ApiProperty({
    description: 'User password (excluded from responses)',
    writeOnly: true,
  })
  password: string;

  @ApiProperty({
    description: 'User version number, increments on update',
    example: 1,
  })
  version: number;

  @ApiProperty({
    description: 'Timestamp of user creation',
    example: 1655000000,
  })
  createdAt: number;

  @ApiProperty({
    description: 'Timestamp of last user update',
    example: 1655000000,
  })
  updatedAt: number;
}
