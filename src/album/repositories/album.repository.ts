import { Injectable } from '@nestjs/common';
import { Album } from '../interfaces/album.interface';
import { BaseInMemoryRepository } from '../../common/repositories/base.repository';

@Injectable()
export class AlbumRepository extends BaseInMemoryRepository<Album> {
  constructor() {
    super();
  }
}