import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, IsInt } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsUUID('4', { message: 'artistId must be a valid UUID v4' })
  artistId?: string | null;

  @IsOptional()
  @IsUUID('4', { message: 'albumId must be a valid UUID v4' })
  albumId?: string | null;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  duration: number;
}