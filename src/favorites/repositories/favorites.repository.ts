import { Injectable } from '@nestjs/common';
import { Favorites } from '../entities/favorites.entity';

@Injectable()
export class FavoritesRepository {
  private favorites: Favorites;

  constructor() {
    this.favorites = {
      artists: [],
      albums: [],
      tracks: [],
    };
  }

  /**
   * Get all favorites
   */
  async findAll(): Promise<Favorites> {
    return { ...this.favorites };
  }

  /**
   * Add an artist to favorites
   * @param artistId - Artist ID to add
   * @returns true if added, false if already exists
   */
  async addArtist(artistId: string): Promise<boolean> {
    if (this.favorites.artists.includes(artistId)) {
      return false;
    }
    this.favorites.artists.push(artistId);
    return true;
  }

  /**
   * Remove an artist from favorites
   * @param artistId - Artist ID to remove
   * @returns true if removed, false if not found
   */
  async removeArtist(artistId: string): Promise<boolean> {
    const index = this.favorites.artists.indexOf(artistId);
    if (index === -1) {
      return false;
    }
    this.favorites.artists.splice(index, 1);
    return true;
  }

  /**
   * Add an album to favorites
   * @param albumId - Album ID to add
   * @returns true if added, false if already exists
   */
  async addAlbum(albumId: string): Promise<boolean> {
    if (this.favorites.albums.includes(albumId)) {
      return false;
    }
    this.favorites.albums.push(albumId);
    return true;
  }

  /**
   * Remove an album from favorites
   * @param albumId - Album ID to remove
   * @returns true if removed, false if not found
   */
  async removeAlbum(albumId: string): Promise<boolean> {
    const index = this.favorites.albums.indexOf(albumId);
    if (index === -1) {
      return false;
    }
    this.favorites.albums.splice(index, 1);
    return true;
  }

  /**
   * Add a track to favorites
   * @param trackId - Track ID to add
   * @returns true if added, false if already exists
   */
  async addTrack(trackId: string): Promise<boolean> {
    if (this.favorites.tracks.includes(trackId)) {
      return false;
    }
    this.favorites.tracks.push(trackId);
    return true;
  }

  /**
   * Remove a track from favorites
   * @param trackId - Track ID to remove
   * @returns true if removed, false if not found
   */
  async removeTrack(trackId: string): Promise<boolean> {
    const index = this.favorites.tracks.indexOf(trackId);
    if (index === -1) {
      return false;
    }
    this.favorites.tracks.splice(index, 1);
    return true;
  }

  /**
   * Check if an artist is in favorites
   * @param artistId - Artist ID to check
   */
  async isArtistFavorite(artistId: string): Promise<boolean> {
    return this.favorites.artists.includes(artistId);
  }

  /**
   * Check if an album is in favorites
   * @param albumId - Album ID to check
   */
  async isAlbumFavorite(albumId: string): Promise<boolean> {
    return this.favorites.albums.includes(albumId);
  }

  /**
   * Check if a track is in favorites
   * @param trackId - Track ID to check
   */
  async isTrackFavorite(trackId: string): Promise<boolean> {
    return this.favorites.tracks.includes(trackId);
  }

  /**
   * Clear all favorites (useful for testing)
   */
  async clear(): Promise<void> {
    this.favorites = {
      artists: [],
      albums: [],
      tracks: [],
    };
  }
}
