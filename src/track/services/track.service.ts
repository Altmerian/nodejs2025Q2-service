import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TrackRepository } from '../repositories/track.repository';
import { Track } from '../entities/track.entity';
import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';
import { EventService, ArtistDeletedEvent, AlbumDeletedEvent } from '../../common/services/event.service';
import { EVENTS } from '../../common/constants/events';
import { getEntityNotFoundMessage, getEntitySuccessMessage } from '../../common/constants/messages';

@Injectable()
export class TrackService {
  private readonly logger = new Logger(TrackService.name);

  constructor(
    private readonly trackRepository: TrackRepository,
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
      Object.entries(updateTrackDto).filter(([_, value]) => value !== undefined)
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
    
    this.eventService.emitTrackDeleted({ id });
    
    this.logger.log(getEntitySuccessMessage('Track', 'deleted', id));
  }

  async updateArtistReference(artistId: string): Promise<void> {
    this.logger.log(`Updating artist references for deleted artist: ${artistId}`);
    
    const tracks = await this.trackRepository.findAll();
    const tracksToUpdate = tracks.filter(track => track.artistId === artistId);
    
    for (const track of tracksToUpdate) {
      await this.trackRepository.update(track.id, { artistId: null });
      this.logger.log(`Updated track ${track.id} - removed artist reference`);
    }
    
    this.logger.log(`Updated ${tracksToUpdate.length} tracks`);
  }

  async updateAlbumReference(albumId: string): Promise<void> {
    this.logger.log(`Updating album references for deleted album: ${albumId}`);
    
    const tracks = await this.trackRepository.findAll();
    const tracksToUpdate = tracks.filter(track => track.albumId === albumId);
    
    for (const track of tracksToUpdate) {
      await this.trackRepository.update(track.id, { albumId: null });
      this.logger.log(`Updated track ${track.id} - removed album reference`);
    }
    
    this.logger.log(`Updated ${tracksToUpdate.length} tracks`);
  }

  @OnEvent(EVENTS.ARTIST.DELETED)
  async handleArtistDeleted(event: ArtistDeletedEvent): Promise<void> {
    await this.updateArtistReference(event.id);
  }

  @OnEvent(EVENTS.ALBUM.DELETED)
  async handleAlbumDeleted(event: AlbumDeletedEvent): Promise<void> {
    await this.updateAlbumReference(event.id);
  }
}