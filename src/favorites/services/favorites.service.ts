import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FavoritesRepository } from '../repositories/favorites.repository';
import { FavoritesResponseDto } from '../dto/favorites-response.dto';
import { ArtistService } from '../../artist/services/artist.service';
import { AlbumService } from '../../album/services/album.service';
import { TrackService } from '../../track/services/track.service';
import {
  ArtistDeletedEvent,
  AlbumDeletedEvent,
  TrackDeletedEvent,
} from '../../common/services/event.service';
import { EVENTS } from '../../common/constants/events';
import { getEntityNotFoundMessage } from '../../common/constants/messages';

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);

  constructor(
    private readonly favoritesRepository: FavoritesRepository,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  /**
   * Get all favorites with full entity data
   */
  async getFavorites(): Promise<FavoritesResponseDto> {
    this.logger.log('Getting all favorites');
    
    const favorites = await this.favoritesRepository.findAll();
    
    // Resolve full entities
    const artists = await Promise.all(
      favorites.artists.map(async (artistId) => {
        try {
          return await this.artistService.findById(artistId);
        } catch (error) {
          this.logger.warn(`Artist ${artistId} not found in favorites, skipping`);
          return null;
        }
      })
    );

    const albums = await Promise.all(
      favorites.albums.map(async (albumId) => {
        try {
          return await this.albumService.findById(albumId);
        } catch (error) {
          this.logger.warn(`Album ${albumId} not found in favorites, skipping`);
          return null;
        }
      })
    );

    const tracks = await Promise.all(
      favorites.tracks.map(async (trackId) => {
        try {
          return await this.trackService.findById(trackId);
        } catch (error) {
          this.logger.warn(`Track ${trackId} not found in favorites, skipping`);
          return null;
        }
      })
    );

    return new FavoritesResponseDto({
      artists: artists.filter(artist => artist !== null),
      albums: albums.filter(album => album !== null),
      tracks: tracks.filter(track => track !== null),
    });
  }

  /**
   * Add an artist to favorites
   */
  async addArtist(artistId: string): Promise<void> {
    this.logger.log(`Adding artist ${artistId} to favorites`);
    
    // Check if artist exists
    try {
      await this.artistService.findById(artistId);
    } catch (error) {
      this.logger.warn(`Artist ${artistId} not found`);
      throw new UnprocessableEntityException(
        getEntityNotFoundMessage('Artist', artistId)
      );
    }

    // Add to favorites (repository handles duplicate check)
    const added = await this.favoritesRepository.addArtist(artistId);
    
    if (!added) {
      this.logger.log(`Artist ${artistId} already in favorites`);
    } else {
      this.logger.log(`Artist ${artistId} added to favorites`);
    }
  }

  /**
   * Remove an artist from favorites
   */
  async removeArtist(artistId: string): Promise<void> {
    this.logger.log(`Removing artist ${artistId} from favorites`);
    
    const removed = await this.favoritesRepository.removeArtist(artistId);
    
    if (!removed) {
      this.logger.warn(`Artist ${artistId} not in favorites`);
      throw new NotFoundException(
        `Artist with id ${artistId} is not favorite`
      );
    }
    
    this.logger.log(`Artist ${artistId} removed from favorites`);
  }

  /**
   * Add an album to favorites
   */
  async addAlbum(albumId: string): Promise<void> {
    this.logger.log(`Adding album ${albumId} to favorites`);
    
    // Check if album exists
    try {
      await this.albumService.findById(albumId);
    } catch (error) {
      this.logger.warn(`Album ${albumId} not found`);
      throw new UnprocessableEntityException(
        getEntityNotFoundMessage('Album', albumId)
      );
    }

    // Add to favorites
    const added = await this.favoritesRepository.addAlbum(albumId);
    
    if (!added) {
      this.logger.log(`Album ${albumId} already in favorites`);
    } else {
      this.logger.log(`Album ${albumId} added to favorites`);
    }
  }

  /**
   * Remove an album from favorites
   */
  async removeAlbum(albumId: string): Promise<void> {
    this.logger.log(`Removing album ${albumId} from favorites`);
    
    const removed = await this.favoritesRepository.removeAlbum(albumId);
    
    if (!removed) {
      this.logger.warn(`Album ${albumId} not in favorites`);
      throw new NotFoundException(
        `Album with id ${albumId} is not favorite`
      );
    }
    
    this.logger.log(`Album ${albumId} removed from favorites`);
  }

  /**
   * Add a track to favorites
   */
  async addTrack(trackId: string): Promise<void> {
    this.logger.log(`Adding track ${trackId} to favorites`);
    
    // Check if track exists
    try {
      await this.trackService.findById(trackId);
    } catch (error) {
      this.logger.warn(`Track ${trackId} not found`);
      throw new UnprocessableEntityException(
        getEntityNotFoundMessage('Track', trackId)
      );
    }

    // Add to favorites
    const added = await this.favoritesRepository.addTrack(trackId);
    
    if (!added) {
      this.logger.log(`Track ${trackId} already in favorites`);
    } else {
      this.logger.log(`Track ${trackId} added to favorites`);
    }
  }

  /**
   * Remove a track from favorites
   */
  async removeTrack(trackId: string): Promise<void> {
    this.logger.log(`Removing track ${trackId} from favorites`);
    
    const removed = await this.favoritesRepository.removeTrack(trackId);
    
    if (!removed) {
      this.logger.warn(`Track ${trackId} not in favorites`);
      throw new NotFoundException(
        `Track with id ${trackId} is not favorite`
      );
    }
    
    this.logger.log(`Track ${trackId} removed from favorites`);
  }

  /**
   * Handle artist deletion event - remove from favorites
   */
  @OnEvent(EVENTS.ARTIST.DELETED)
  async handleArtistDeleted(event: ArtistDeletedEvent): Promise<void> {
    this.logger.log(`Handling artist deletion event for ${event.id}`);
    await this.favoritesRepository.removeArtist(event.id);
  }

  /**
   * Handle album deletion event - remove from favorites
   */
  @OnEvent(EVENTS.ALBUM.DELETED)
  async handleAlbumDeleted(event: AlbumDeletedEvent): Promise<void> {
    this.logger.log(`Handling album deletion event for ${event.id}`);
    await this.favoritesRepository.removeAlbum(event.id);
  }

  /**
   * Handle track deletion event - remove from favorites
   */
  @OnEvent(EVENTS.TRACK.DELETED)
  async handleTrackDeleted(event: TrackDeletedEvent): Promise<void> {
    this.logger.log(`Handling track deletion event for ${event.id}`);
    await this.favoritesRepository.removeTrack(event.id);
  }
}