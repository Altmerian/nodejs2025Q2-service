import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './services/artist.service';
import { PrismaArtistRepository } from './repositories/prisma-artist.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ArtistController],
  providers: [ArtistService, PrismaArtistRepository],
  exports: [ArtistService, PrismaArtistRepository],
})
export class ArtistModule {}
