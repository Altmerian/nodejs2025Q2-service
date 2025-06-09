import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './services/album.service';
import { PrismaAlbumRepository } from './repositories/prisma-album.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AlbumController],
  providers: [AlbumService, PrismaAlbumRepository],
  exports: [AlbumService, PrismaAlbumRepository],
})
export class AlbumModule {}
