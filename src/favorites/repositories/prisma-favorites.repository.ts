import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Favorites } from '../entities/favorites.entity';

@Injectable()
export class PrismaFavoritesRepository {
  private readonly SINGLETON_ID = 'singleton';

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all favorites
   */
  async findAll(): Promise<Favorites> {
    const favorites = await this.prisma.favorites.findUnique({
      where: { id: this.SINGLETON_ID },
    });

    if (!favorites) {
      // Create default empty favorites if not exists
      return await this.createDefault();
    }

    return this.mapToEntity(favorites);
  }

  /**
   * Add an artist to favorites
   * @param artistId - Artist ID to add
   * @returns true if added, false if already exists
   */
  async addArtist(artistId: string): Promise<boolean> {
    const favorites = await this.findAll();
    
    if (favorites.artists.includes(artistId)) {
      return false;
    }

    const updatedArtists = [...favorites.artists, artistId];
    
    await this.prisma.favorites.upsert({
      where: { id: this.SINGLETON_ID },
      update: { artists: updatedArtists },
      create: {
        id: this.SINGLETON_ID,
        artists: updatedArtists,
        albums: favorites.albums,
        tracks: favorites.tracks,
      },
    });

    return true;
  }

  /**
   * Remove an artist from favorites
   * @param artistId - Artist ID to remove
   * @returns true if removed, false if not found
   */
  async removeArtist(artistId: string): Promise<boolean> {
    const favorites = await this.findAll();
    
    if (!favorites.artists.includes(artistId)) {
      return false;
    }

    const updatedArtists = favorites.artists.filter(id => id !== artistId);
    
    await this.prisma.favorites.update({
      where: { id: this.SINGLETON_ID },
      data: { artists: updatedArtists },
    });

    return true;
  }

  /**
   * Add an album to favorites
   * @param albumId - Album ID to add
   * @returns true if added, false if already exists
   */
  async addAlbum(albumId: string): Promise<boolean> {
    const favorites = await this.findAll();
    
    if (favorites.albums.includes(albumId)) {
      return false;
    }

    const updatedAlbums = [...favorites.albums, albumId];
    
    await this.prisma.favorites.upsert({
      where: { id: this.SINGLETON_ID },
      update: { albums: updatedAlbums },
      create: {
        id: this.SINGLETON_ID,
        artists: favorites.artists,
        albums: updatedAlbums,
        tracks: favorites.tracks,
      },
    });

    return true;
  }

  /**
   * Remove an album from favorites
   * @param albumId - Album ID to remove
   * @returns true if removed, false if not found
   */
  async removeAlbum(albumId: string): Promise<boolean> {
    const favorites = await this.findAll();
    
    if (!favorites.albums.includes(albumId)) {
      return false;
    }

    const updatedAlbums = favorites.albums.filter(id => id !== albumId);
    
    await this.prisma.favorites.update({
      where: { id: this.SINGLETON_ID },
      data: { albums: updatedAlbums },
    });

    return true;
  }

  /**
   * Add a track to favorites
   * @param trackId - Track ID to add
   * @returns true if added, false if already exists
   */
  async addTrack(trackId: string): Promise<boolean> {
    const favorites = await this.findAll();
    
    if (favorites.tracks.includes(trackId)) {
      return false;
    }

    const updatedTracks = [...favorites.tracks, trackId];
    
    await this.prisma.favorites.upsert({
      where: { id: this.SINGLETON_ID },
      update: { tracks: updatedTracks },
      create: {
        id: this.SINGLETON_ID,
        artists: favorites.artists,
        albums: favorites.albums,
        tracks: updatedTracks,
      },
    });

    return true;
  }

  /**
   * Remove a track from favorites
   * @param trackId - Track ID to remove
   * @returns true if removed, false if not found
   */
  async removeTrack(trackId: string): Promise<boolean> {
    const favorites = await this.findAll();
    
    if (!favorites.tracks.includes(trackId)) {
      return false;
    }

    const updatedTracks = favorites.tracks.filter(id => id !== trackId);
    
    await this.prisma.favorites.update({
      where: { id: this.SINGLETON_ID },
      data: { tracks: updatedTracks },
    });

    return true;
  }

  /**
   * Check if an artist is in favorites
   * @param artistId - Artist ID to check
   */
  async isArtistFavorite(artistId: string): Promise<boolean> {
    const favorites = await this.findAll();
    return favorites.artists.includes(artistId);
  }

  /**
   * Check if an album is in favorites
   * @param albumId - Album ID to check
   */
  async isAlbumFavorite(albumId: string): Promise<boolean> {
    const favorites = await this.findAll();
    return favorites.albums.includes(albumId);
  }

  /**
   * Check if a track is in favorites
   * @param trackId - Track ID to check
   */
  async isTrackFavorite(trackId: string): Promise<boolean> {
    const favorites = await this.findAll();
    return favorites.tracks.includes(trackId);
  }

  /**
   * Clear all favorites (useful for testing)
   */
  async clear(): Promise<void> {
    await this.prisma.favorites.upsert({
      where: { id: this.SINGLETON_ID },
      update: {
        artists: [],
        albums: [],
        tracks: [],
      },
      create: {
        id: this.SINGLETON_ID,
        artists: [],
        albums: [],
        tracks: [],
      },
    });
  }

  /**
   * Create default empty favorites
   */
  private async createDefault(): Promise<Favorites> {
    const favorites = await this.prisma.favorites.create({
      data: {
        id: this.SINGLETON_ID,
        artists: [],
        albums: [],
        tracks: [],
      },
    });

    return this.mapToEntity(favorites);
  }

  /**
   * Map Prisma favorites to domain entity
   */
  private mapToEntity(prismaFavorites: any): Favorites {
    return {
      artists: prismaFavorites.artists || [],
      albums: prismaFavorites.albums || [],
      tracks: prismaFavorites.tracks || [],
    };
  }
}