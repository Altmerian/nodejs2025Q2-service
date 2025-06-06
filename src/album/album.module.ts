import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './services/album.service';
import { AlbumRepository } from './repositories/album.repository';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, AlbumRepository],
  exports: [AlbumService],
})
export class AlbumModule {}
