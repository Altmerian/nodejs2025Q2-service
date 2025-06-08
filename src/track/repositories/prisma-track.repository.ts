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

  async findById(id: string): Promise<Track | null> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });
    return track ? this.mapToEntity(track) : null;
  }

  async create(entity: Omit<Track, 'id'>): Promise<Track> {
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