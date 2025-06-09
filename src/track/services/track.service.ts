import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaTrackRepository } from '../repositories/prisma-track.repository';
import { Track } from '../entities/track.entity';
import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';
import { EventService } from '../../common/services/event.service';
import { getEntityNotFoundMessage, getEntitySuccessMessage } from '../../common/constants/messages';

@Injectable()
export class TrackService {
  private readonly logger = new Logger(TrackService.name);

  constructor(
    private readonly trackRepository: PrismaTrackRepository,
    private readonly eventService: EventService,
  ) {}

  async findAll(): Promise<Track[]> {
    this.logger.log('Finding all tracks');
    const tracks = await this.trackRepository.findAll();
    this.logger.log(`Found ${tracks.length} tracks`);
    return tracks;
  }

  async findById(id: string): Promise<Track> {
    this.logger.log(`Finding track with id: ${id}`);
    const track = await this.trackRepository.findById(id);

    if (!track) {
      this.logger.warn(`Track with id ${id} not found`);
      throw new NotFoundException(getEntityNotFoundMessage('Track', id));
    }

    this.logger.log(`Found track: ${track.name}`);
    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    this.logger.log(`Creating new track: ${createTrackDto.name}`);

    const trackData: Omit<Track, 'id'> = {
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      artistId: createTrackDto.artistId || null,
      albumId: createTrackDto.albumId || null,
    };

    const newTrack = await this.trackRepository.create(trackData);
    this.logger.log(`Track created successfully with id: ${newTrack.id}`);

    return newTrack;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    this.logger.log(`Updating track with id: ${id}`);

    await this.findById(id);

    const updatedData: Partial<Track> = Object.fromEntries(
      Object.entries(updateTrackDto).filter(([, value]) => value !== undefined),
    );

    const updatedTrack = await this.trackRepository.update(id, updatedData);

    if (!updatedTrack) {
      throw new NotFoundException(getEntityNotFoundMessage('Track', id));
    }

    this.logger.log(`Track ${id} updated successfully`);
    return updatedTrack;
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting track with id: ${id}`);

    await this.findById(id); // Verify track exists

    await this.trackRepository.delete(id);

    await this.eventService.emitTrackDeleted({ id });

    this.logger.log(getEntitySuccessMessage('Track', 'deleted', id));
  }
}
