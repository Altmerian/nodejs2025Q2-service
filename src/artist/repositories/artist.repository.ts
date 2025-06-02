import { Injectable } from '@nestjs/common';
import { BaseInMemoryRepository } from '../../common/repositories/base.repository';
import { Artist } from '../entities/artist.entity';

@Injectable()
export class ArtistRepository extends BaseInMemoryRepository<Artist> {
  constructor() {
    super();
  }
}