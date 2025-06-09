import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Favorites } from '../entities/favorites.entity';

@Injectable()
export class PrismaFavoritesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all favorites (returns IDs for compatibility with existing service)
   */
  async findAll(): Promise<Favorites> {
    const [favoriteArtists, favoriteAlbums, favoriteTracks] = await Promise.all([
      this.prisma.favoriteArtist.findMany(),
      this.prisma.favoriteAlbum.findMany(),
      this.prisma.favoriteTrack.findMany(),
    ]);

    return {
      artists: favoriteArtists.map((fa) => fa.artistId),
      albums: favoriteAlbums.map((fa) => fa.albumId),
      tracks: favoriteTracks.map((ft) => ft.trackId),
    };
  }

  /**
   * Add an artist to favorites
   * @param artistId - Artist ID to add
   * @returns true if added, false if already exists
   */
  async addArtist(artistId: string): Promise<boolean> {
    try {
      await this.prisma.favoriteArtist.create({
        data: { artistId },
      });
      return true;
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Unique constraint violation - already exists
        return false;
      }
      throw error;
    }
  }

  /**
   * Remove an artist from favorites
   * @param artistId - Artist ID to remove
   * @returns true if removed, false if not found
   */
  async removeArtist(artistId: string): Promise<boolean> {
    try {
      await this.prisma.favoriteArtist.delete({
        where: { artistId },
      });
      return true;
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Record not found
        return false;
      }
      throw error;
    }
  }

  /**
   * Add an album to favorites
   * @param albumId - Album ID to add
   * @returns true if added, false if already exists
   */
  async addAlbum(albumId: string): Promise<boolean> {
    try {
      await this.prisma.favoriteAlbum.create({
        data: { albumId },
      });
      return true;
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Unique constraint violation - already exists
        return false;
      }
      throw error;
    }
  }

  /**
   * Remove an album from favorites
   * @param albumId - Album ID to remove
   * @returns true if removed, false if not found
   */
  async removeAlbum(albumId: string): Promise<boolean> {
    try {
      await this.prisma.favoriteAlbum.delete({
        where: { albumId },
      });
      return true;
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Record not found
        return false;
      }
      throw error;
    }
  }

  /**
   * Add a track to favorites
   * @param trackId - Track ID to add
   * @returns true if added, false if already exists
   */
  async addTrack(trackId: string): Promise<boolean> {
    try {
      await this.prisma.favoriteTrack.create({
        data: { trackId },
      });
      return true;
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Unique constraint violation - already exists
        return false;
      }
      throw error;
    }
  }

  /**
   * Remove a track from favorites
   * @param trackId - Track ID to remove
   * @returns true if removed, false if not found
   */
  async removeTrack(trackId: string): Promise<boolean> {
    try {
      await this.prisma.favoriteTrack.delete({
        where: { trackId },
      });
      return true;
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Record not found
        return false;
      }
      throw error;
    }
  }

  /**
   * Check if an artist is in favorites
   * @param artistId - Artist ID to check
   */
  async isArtistFavorite(artistId: string): Promise<boolean> {
    const count = await this.prisma.favoriteArtist.count({
      where: { artistId },
    });
    return count > 0;
  }

  /**
   * Check if an album is in favorites
   * @param albumId - Album ID to check
   */
  async isAlbumFavorite(albumId: string): Promise<boolean> {
    const count = await this.prisma.favoriteAlbum.count({
      where: { albumId },
    });
    return count > 0;
  }

  /**
   * Check if a track is in favorites
   * @param trackId - Track ID to check
   */
  async isTrackFavorite(trackId: string): Promise<boolean> {
    const count = await this.prisma.favoriteTrack.count({
      where: { trackId },
    });
    return count > 0;
  }

  /**
   * Clear all favorites (useful for testing)
   */
  async clear(): Promise<void> {
    await Promise.all([
      this.prisma.favoriteTrack.deleteMany(),
      this.prisma.favoriteAlbum.deleteMany(),
      this.prisma.favoriteArtist.deleteMany(),
    ]);
  }

  /**
   * Get favorites with full entity data using Prisma relations
   */
  async findAllWithEntities() {
    const [favoriteArtists, favoriteAlbums, favoriteTracks] = await Promise.all([
      this.prisma.favoriteArtist.findMany({
        include: { artist: true },
      }),
      this.prisma.favoriteAlbum.findMany({
        include: { album: true },
      }),
      this.prisma.favoriteTrack.findMany({
        include: { track: true },
      }),
    ]);

    return {
      artists: favoriteArtists.map((fa) => fa.artist).filter((artist) => artist !== null),
      albums: favoriteAlbums.map((fa) => fa.album).filter((album) => album !== null),
      tracks: favoriteTracks.map((ft) => ft.track).filter((track) => track !== null),
    };
  }
}
