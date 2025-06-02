import { Artist } from '../../artist/interfaces/artist.interface';
import { Album } from '../../album/interfaces/album.interface';
import { Track } from '../../track/interfaces/track.interface';

export class FavoritesResponseDto {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];

  constructor(partial: Partial<FavoritesResponseDto>) {
    Object.assign(this, partial);
  }
}