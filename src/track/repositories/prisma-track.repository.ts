import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IBaseRepository } from '../../common/repositories/base.repository';
import { Track } from '../entities/track.entity';
import { generateUuid } from '../../common/utils/uuid.utils';

@Injectable()
export class PrismaTrackRepository implements IBaseRepository<Track> {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Track[]> {
    const tracks = await this.prisma.track.findMany();
    return tracks.map(this.mapToEntity);
  }

  async findAllWithRelations(): Promise<Track[]> {
    const tracks = await this.prisma.track.findMany({
      include: {
        artist: true,
        album: true,
      },
    });
    return tracks.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Track | null> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });
    return track ? this.mapToEntity(track) : null;
  }

  async findByIdWithRelations(id: string): Promise<Track | null> {
    const track = await this.prisma.track.findUnique({
      where: { id },
      include: {
        artist: true,
        album: true,
      },
    });
    return track ? this.mapToEntity(track) : null;
  }

  async create(entity: Omit<Track, 'id'>): Promise<Track> {
    try {
      const id = generateUuid();
      const track = await this.prisma.track.create({
        data: {
          id,
          name: entity.name,
          duration: entity.duration,
          artistId: entity.artistId,
          albumId: entity.albumId,
        },
      });
      return this.mapToEntity(track);
    } catch (error: any) {
      // Check if it's a foreign key constraint error
      if (error.code === 'P2003') {
        // Determine which foreign key constraint failed
        if (error.meta?.field_name?.includes('artistId')) {
          throw new Error('Invalid artistId: Artist does not exist');
        } else if (error.meta?.field_name?.includes('albumId')) {
          throw new Error('Invalid albumId: Album does not exist');
        } else {
          throw new Error('Invalid reference: Related entity does not exist');
        }
      }
      throw error;
    }
  }

  async update(id: string, entity: Partial<Omit<Track, 'id'>>): Promise<Track | null> {
    try {
      const updateData = {
        ...(entity.name !== undefined && { name: entity.name }),
        ...(entity.duration !== undefined && { duration: entity.duration }),
        ...(entity.artistId !== undefined && { artistId: entity.artistId }),
        ...(entity.albumId !== undefined && { albumId: entity.albumId }),
      };

      const track = await this.prisma.track.update({
        where: { id },
        data: updateData,
      });
      return this.mapToEntity(track);
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Record not found
        return null;
      }
      // Check if it's a foreign key constraint error
      if (error.code === 'P2003') {
        // Determine which foreign key constraint failed
        if (error.meta?.field_name?.includes('artistId')) {
          throw new Error('Invalid artistId: Artist does not exist');
        } else if (error.meta?.field_name?.includes('albumId')) {
          throw new Error('Invalid albumId: Album does not exist');
        } else {
          throw new Error('Invalid reference: Related entity does not exist');
        }
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.track.delete({
        where: { id },
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

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.track.count({
      where: { id },
    });
    return count > 0;
  }

  /**
   * Map Prisma track to domain entity
   */
  private mapToEntity(prismaTrack: any): Track {
    return {
      id: prismaTrack.id,
      name: prismaTrack.name,
      duration: prismaTrack.duration,
      artistId: prismaTrack.artistId,
      albumId: prismaTrack.albumId,
    };
  }
}
