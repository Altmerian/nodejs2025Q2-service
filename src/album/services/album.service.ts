import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AlbumRepository } from '../repositories/album.repository';
import { Album } from '../entities/album.entity';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';
import { EventService, ArtistDeletedEvent } from '../../common/services/event.service';
import { EVENTS } from '../../common/constants/events';
import { getEntityNotFoundMessage, getEntitySuccessMessage } from '../../common/constants/messages';

@Injectable()
export class AlbumService {
  private readonly logger = new Logger(AlbumService.name);

  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly eventService: EventService,
  ) {}

  async findAll(): Promise<Album[]> {
    this.logger.log('Finding all albums');
    const albums = await this.albumRepository.findAll();
    this.logger.log(`Found ${albums.length} albums`);
    return albums;
  }

  async findById(id: string): Promise<Album> {
    this.logger.log(`Finding album with id: ${id}`);
    const album = await this.albumRepository.findById(id);
    
    if (!album) {
      this.logger.warn(`Album with id ${id} not found`);
      throw new NotFoundException(getEntityNotFoundMessage('Album', id));
    }
    
    this.logger.log(`Found album: ${album.name}`);
    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    this.logger.log(`Creating new album: ${createAlbumDto.name}`);
    
    const albumData: Omit<Album, 'id'> = {
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId || null,
    };
    
    const newAlbum = await this.albumRepository.create(albumData);
    this.logger.log(`Album created successfully with id: ${newAlbum.id}`);
    
    return newAlbum;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    this.logger.log(`Updating album with id: ${id}`);
    
    await this.findById(id);
    
    const updatedData: Partial<Album> = Object.fromEntries(
      Object.entries(updateAlbumDto).filter(([_, value]) => value !== undefined)
    );
    
    const updatedAlbum = await this.albumRepository.update(id, updatedData);
    
    if (!updatedAlbum) {
      throw new NotFoundException(getEntityNotFoundMessage('Album', id));
    }
    
    this.logger.log(`Album ${id} updated successfully`);
    return updatedAlbum;
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting album with id: ${id}`);
    
    await this.findById(id); // Verify album exists
    
    await this.albumRepository.delete(id);
    
    this.eventService.emitAlbumDeleted({ id });
    
    this.logger.log(getEntitySuccessMessage('Album', 'deleted', id));
  }

  async updateArtistReference(artistId: string): Promise<void> {
    this.logger.log(`Updating artist references for deleted artist: ${artistId}`);
    
    const albums = await this.albumRepository.findAll();
    const albumsToUpdate = albums.filter(album => album.artistId === artistId);
    
    for (const album of albumsToUpdate) {
      await this.albumRepository.update(album.id, { artistId: null });
      this.logger.log(`Updated album ${album.id} - removed artist reference`);
    }
    
    this.logger.log(`Updated ${albumsToUpdate.length} albums`);
  }

  @OnEvent(EVENTS.ARTIST.DELETED)
  async handleArtistDeleted(event: ArtistDeletedEvent): Promise<void> {
    await this.updateArtistReference(event.id);
  }
}