import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IBaseRepository } from '../../common/repositories/base.repository';
import { User } from '../entities/user.entity';
import { generateUuid } from '../../common/utils/uuid.utils';

@Injectable()
export class PrismaUserRepository implements IBaseRepository<User> {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(this.mapToEntity);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.mapToEntity(user) : null;
  }

  async create(entity: Omit<User, 'id'>): Promise<User> {
    const id = generateUuid();
    const user = await this.prisma.user.create({
      data: {
        id,
        login: entity.login,
        password: entity.password,
        version: entity.version,
        createdAt: BigInt(entity.createdAt),
        updatedAt: BigInt(entity.updatedAt),
      },
    });
    return this.mapToEntity(user);
  }

  async update(id: string, entity: Partial<Omit<User, 'id'>>): Promise<User | null> {
    try {
      const updateData = {
        ...(entity.login !== undefined && { login: entity.login }),
        ...(entity.password !== undefined && { password: entity.password }),
        ...(entity.version !== undefined && { version: entity.version }),
        ...(entity.createdAt !== undefined && { createdAt: BigInt(entity.createdAt) }),
        ...(entity.updatedAt !== undefined && { updatedAt: BigInt(entity.updatedAt) }),
      };

      const user = await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
      return this.mapToEntity(user);
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
      await this.prisma.user.delete({
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
    const count = await this.prisma.user.count({
      where: { id },
    });
    return count > 0;
  }

  // User-specific method
  async findByLogin(login: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { login },
    });
    return user ? this.mapToEntity(user) : null;
  }

  /**
   * Map Prisma user to domain entity
   * Handles BigInt conversion for timestamps
   */
  private mapToEntity(prismaUser: any): User {
    return {
      id: prismaUser.id,
      login: prismaUser.login,
      password: prismaUser.password,
      version: prismaUser.version,
      createdAt: Number(prismaUser.createdAt),
      updatedAt: Number(prismaUser.updatedAt),
    };
  }
}
