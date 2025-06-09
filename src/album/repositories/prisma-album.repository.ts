import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IBaseRepository } from '../../common/repositories/base.repository';
import { Album } from '../entities/album.entity';
import { generateUuid } from '../../common/utils/uuid.utils';

@Injectable()
export class PrismaAlbumRepository implements IBaseRepository<Album> {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Album[]> {
    const albums = await this.prisma.album.findMany();
    return albums.map(this.mapToEntity);
  }

  async findById(id: string): Promise<Album | null> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    return album ? this.mapToEntity(album) : null;
  }

  async create(entity: Omit<Album, 'id'>): Promise<Album> {
    try {
      const id = generateUuid();
      const album = await this.prisma.album.create({
        data: {
          id,
          name: entity.name,
          year: entity.year,
          artistId: entity.artistId,
        },
      });
      return this.mapToEntity(album);
    } catch (error: any) {
      // Check if it's a foreign key constraint error
      if (error.code === 'P2003') {
        throw new Error('Invalid artistId: Artist does not exist');
      }
      throw error;
    }
  }

  async update(id: string, entity: Partial<Omit<Album, 'id'>>): Promise<Album | null> {
    try {
      const updateData = {
        ...(entity.name !== undefined && { name: entity.name }),
        ...(entity.year !== undefined && { year: entity.year }),
        ...(entity.artistId !== undefined && { artistId: entity.artistId }),
      };

      const album = await this.prisma.album.update({
        where: { id },
        data: updateData,
      });
      return this.mapToEntity(album);
    } catch (error: any) {
      if (error.code === 'P2025') {
        // Record not found
        return null;
      }
      // Check if it's a foreign key constraint error
      if (error.code === 'P2003') {
        throw new Error('Invalid artistId: Artist does not exist');
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.album.delete({
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
    const count = await this.prisma.album.count({
      where: { id },
    });
    return count > 0;
  }

  /**
   * Map Prisma album to domain entity
   */
  private mapToEntity(prismaAlbum: any): Album {
    return {
      id: prismaAlbum.id,
      name: prismaAlbum.name,
      year: prismaAlbum.year,
      artistId: prismaAlbum.artistId,
    };
  }
}
