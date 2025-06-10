import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ArtistRepository } from '../repositories/artist.repository';
import { EventService, getEntityNotFoundMessage, getEntitySuccessMessage } from '../../common';
import { Artist } from '../entities/artist.entity';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';

@Injectable()
export class ArtistService {
  private readonly logger = new Logger(ArtistService.name);

  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly eventService: EventService,
  ) {}

  async findAll(): Promise<Artist[]> {
    this.logger.log('Fetching all artists');
    const artists = await this.artistRepository.findAll();
    this.logger.log(`Found ${artists.length} artists`);
    return artists;
  }

  async findById(id: string): Promise<Artist> {
    this.logger.log(`Fetching artist with id: ${id}`);
    const artist = await this.artistRepository.findById(id);
    if (!artist) {
      this.logger.warn(getEntityNotFoundMessage('Artist', id));
      throw new NotFoundException(getEntityNotFoundMessage('Artist', id));
    }
    this.logger.log(`Found artist with id: ${id}`);
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    this.logger.log(`Creating new artist with name: ${createArtistDto.name}`);
    
    const artistData: Omit<Artist, 'id'> = {
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    const artist = await this.artistRepository.create(artistData);
    this.logger.log(getEntitySuccessMessage('Artist', 'created', artist.id));
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    this.logger.log(`Updating artist with id: ${id}`);
    
    const existingArtist = await this.artistRepository.findById(id);
    if (!existingArtist) {
      this.logger.warn(getEntityNotFoundMessage('Artist', id));
      throw new NotFoundException(getEntityNotFoundMessage('Artist', id));
    }

    const updatedArtist = await this.artistRepository.update(id, updateArtistDto);
    this.logger.log(getEntitySuccessMessage('Artist', 'updated', id));
    return updatedArtist!;
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting artist with id: ${id}`);
    
    const artist = await this.artistRepository.findById(id);
    if (!artist) {
      this.logger.warn(getEntityNotFoundMessage('Artist', id));
      throw new NotFoundException(getEntityNotFoundMessage('Artist', id));
    }

    await this.artistRepository.delete(id);
    
    // Emit delete event for cascading operations
    this.eventService.emitArtistDeleted({ id });
    
    this.logger.log(getEntitySuccessMessage('Artist', 'deleted', id));
  }
}