import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './services/track.service';
import { TrackRepository } from './repositories/track.repository';

@Module({
  controllers: [TrackController],
  providers: [TrackService, TrackRepository],
  exports: [TrackService],
})
export class TrackModule {}
