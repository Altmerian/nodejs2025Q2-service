import { Injectable } from '@nestjs/common';
import { Track } from '../entities/track.entity';
import { BaseInMemoryRepository } from '../../common/repositories/base.repository';

@Injectable()
export class TrackRepository extends BaseInMemoryRepository<Track> {
  constructor() {
    super();
  }
}
