import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './services/favorites.service';
import { PrismaFavoritesRepository } from './repositories/prisma-favorites.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';
import { TrackModule } from '../track/track.module';

@Module({
  imports: [PrismaModule, ArtistModule, AlbumModule, TrackModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaFavoritesRepository],
  exports: [FavoritesService, PrismaFavoritesRepository],
})
export class FavoritesModule {}
