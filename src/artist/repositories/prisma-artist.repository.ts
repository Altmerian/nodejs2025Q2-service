import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IBaseRepository } from '../../common/repositories/base.repository';
import { Artist } from '../entities/artist.entity';
import { generateUuid } from '../../common/utils/uuid.utils';

@Injectable()
export class PrismaArtistRepository implements IBaseRepository<Artist> {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Artist[]> {
    const artists = await this.prisma.artist.findMany();
    return artists.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Artist | null> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });
    return artist ? this.mapToEntity(artist) : null;
  }

  async findByIdWithRelations(id: string): Promise<Artist | null> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: {
        albums: true,
        tracks: true,
      },
    });
    return artist ? this.mapToEntity(artist) : null;
  }

  async create(entity: Omit<Artist, 'id'>): Promise<Artist> {
    const id = generateUuid();
    const artist = await this.prisma.artist.create({
      data: {
        id,
        name: entity.name,
        grammy: entity.grammy,
      },
    });
    return this.mapToEntity(artist);
  }

  async update(id: string, entity: Partial<Omit<Artist, 'id'>>): Promise<Artist | null> {
    try {
      const updateData = {
        ...(entity.name !== undefined && { name: entity.name }),
        ...(entity.grammy !== undefined && { grammy: entity.grammy }),
      };

      const artist = await this.prisma.artist.update({
        where: { id },
        data: updateData,
      });
      return this.mapToEntity(artist);
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
      await this.prisma.artist.delete({
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
    const count = await this.prisma.artist.count({
      where: { id },
    });
    return count > 0;
  }

  /**
   * Map Prisma artist to domain entity
   */
  private mapToEntity(prismaArtist: any): Artist {
    return {
      id: prismaArtist.id,
      name: prismaArtist.name,
      grammy: prismaArtist.grammy,
    };
  }
}
