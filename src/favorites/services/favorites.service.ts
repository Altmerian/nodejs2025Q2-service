import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { PrismaFavoritesRepository } from '../repositories/prisma-favorites.repository';
import { FavoritesResponseDto } from '../dto/favorites-response.dto';
import { ArtistService } from '../../artist/services/artist.service';
import { AlbumService } from '../../album/services/album.service';
import { TrackService } from '../../track/services/track.service';
import { getEntityNotFoundMessage } from '../../common/constants/messages';

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);

  constructor(
    private readonly favoritesRepository: PrismaFavoritesRepository,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  /**
   * Get all favorites with full entity data
   */
  async getFavorites(): Promise<FavoritesResponseDto> {
    this.logger.log('Getting all favorites');

    // Use the new repository method that leverages Prisma relations
    const favoritesWithEntities = await this.favoritesRepository.findAllWithEntities();

    return new FavoritesResponseDto({
      artists: favoritesWithEntities.artists,
      albums: favoritesWithEntities.albums,
      tracks: favoritesWithEntities.tracks,
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
    } catch {
      this.logger.warn(`Artist ${artistId} not found`);
      throw new UnprocessableEntityException(getEntityNotFoundMessage('Artist', artistId));
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
      throw new NotFoundException(`Artist with id ${artistId} is not favorite`);
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
    } catch {
      this.logger.warn(`Album ${albumId} not found`);
      throw new UnprocessableEntityException(getEntityNotFoundMessage('Album', albumId));
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
      throw new NotFoundException(`Album with id ${albumId} is not favorite`);
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
    } catch {
      this.logger.warn(`Track ${trackId} not found`);
      throw new UnprocessableEntityException(getEntityNotFoundMessage('Track', trackId));
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
      throw new NotFoundException(`Track with id ${trackId} is not favorite`);
    }

    this.logger.log(`Track ${trackId} removed from favorites`);
  }

  // Note: Event handlers removed because FK constraints with CASCADE DELETE
  // automatically handle cleanup when entities are deleted
}
