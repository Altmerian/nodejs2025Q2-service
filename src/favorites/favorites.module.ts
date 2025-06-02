import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './services/favorites.service';
import { FavoritesRepository } from './repositories/favorites.repository';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';
import { TrackModule } from '../track/track.module';

@Module({
  imports: [ArtistModule, AlbumModule, TrackModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, FavoritesRepository],
  exports: [FavoritesService],
})
export class FavoritesModule {}