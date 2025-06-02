import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsOptional()
  @IsUUID('4', { message: 'artistId must be a valid UUID v4' })
  artistId?: string | null;
}