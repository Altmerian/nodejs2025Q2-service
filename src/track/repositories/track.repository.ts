import { Injectable } from '@nestjs/common';
import { Track } from '../interfaces/track.interface';
import { BaseInMemoryRepository } from '../../common/repositories/base.repository';

@Injectable()
export class TrackRepository extends BaseInMemoryRepository<Track> {
  constructor() {
    super();
  }
}