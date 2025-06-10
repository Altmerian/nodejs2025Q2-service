import { Injectable } from '@nestjs/common';
import { Album } from '../entities/album.entity';
import { BaseInMemoryRepository } from '../../common/repositories/base.repository';

@Injectable()
export class AlbumRepository extends BaseInMemoryRepository<Album> {
  constructor() {
    super();
  }
}