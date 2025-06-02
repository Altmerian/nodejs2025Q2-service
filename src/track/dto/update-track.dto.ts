import { IsOptional, IsString, IsNumber, IsUUID, IsInt } from 'class-validator';

export class UpdateTrackDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID('4', { message: 'artistId must be a valid UUID v4' })
  artistId?: string | null;

  @IsOptional()
  @IsUUID('4', { message: 'albumId must be a valid UUID v4' })
  albumId?: string | null;

  @IsOptional()
  @IsNumber()
  @IsInt()
  duration?: number;
}