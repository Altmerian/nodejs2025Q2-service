import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../prisma/node_modules/.prisma/client-test';

@Injectable()
export class PrismaTestService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'file::memory:?cache=shared',
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();

    // Push schema to in-memory SQLite database
    // This creates tables based on the Prisma schema automatically
    await this.pushSchema();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async pushSchema() {
    // Auto-generated DDL from schema.prisma - DO NOT EDIT MANUALLY
    // Run 'npm run schema:sync-test' to regenerate
    try {
      await this.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "users" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "login" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "version" INTEGER NOT NULL,
          "createdAt" BIGINT NOT NULL,
          "updatedAt" BIGINT NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "users_login_key" ON "users"("login");
      `);

      await this.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "artists" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "grammy" BOOLEAN NOT NULL
        );
      `);

      await this.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "albums" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "year" INTEGER NOT NULL,
          "artistId" TEXT
        );
      `);

      await this.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "tracks" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "duration" INTEGER NOT NULL,
          "artistId" TEXT,
          "albumId" TEXT
        );
      `);

      await this.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "favorites" (
          "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
          "artists" TEXT NOT NULL DEFAULT '[]',
          "albums" TEXT NOT NULL DEFAULT '[]',
          "tracks" TEXT NOT NULL DEFAULT '[]'
        );
      `);
    } catch (error) {
      console.error('Failed to initialize test database schema:', error);
      throw error;
    }
  }

  async cleanDatabase() {
    // Clean all tables in correct order using Prisma models
    await this.favorites.deleteMany();
    await this.track.deleteMany();
    await this.album.deleteMany();
    await this.artist.deleteMany();
    await this.user.deleteMany();
  }
}
