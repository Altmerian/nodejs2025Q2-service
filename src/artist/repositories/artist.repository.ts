import { Injectable } from '@nestjs/common';
import { BaseInMemoryRepository } from '../../common/repositories/base.repository';
import { Artist } from '../interfaces/artist.interface';

@Injectable()
export class ArtistRepository extends BaseInMemoryRepository<Artist> {
}