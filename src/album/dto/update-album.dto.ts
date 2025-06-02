import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';

export class UpdateAlbumDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsUUID('4', { message: 'artistId must be a valid UUID v4' })
  artistId?: string | null;
}