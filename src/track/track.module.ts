import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './services/track.service';
import { PrismaTrackRepository } from './repositories/prisma-track.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrackController],
  providers: [TrackService, PrismaTrackRepository],
  exports: [TrackService, PrismaTrackRepository],
})
export class TrackModule {}
