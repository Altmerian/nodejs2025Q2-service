import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../album/entities/album.entity';
import { Track } from '../../track/entities/track.entity';

export class FavoritesResponseDto {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];

  constructor(partial: Partial<FavoritesResponseDto>) {
    Object.assign(this, partial);
  }
}
