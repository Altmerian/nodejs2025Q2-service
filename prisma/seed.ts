import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data in reverse dependency order
  console.log('🧹 Clearing existing data...');
  await prisma.favorites.deleteMany();
  await prisma.track.deleteMany();
  await prisma.album.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  console.log('👥 Seeding users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const now = Date.now();

  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        login: 'john_doe',
        password: hashedPassword,
        version: 1,
        createdAt: BigInt(now),
        updatedAt: BigInt(now),
      },
    }),
    prisma.user.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440002',
        login: 'jane_smith',
        password: hashedPassword,
        version: 1,
        createdAt: BigInt(now + 1000),
        updatedAt: BigInt(now + 1000),
      },
    }),
    prisma.user.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440003',
        login: 'admin_user',
        password: hashedPassword,
        version: 1,
        createdAt: BigInt(now + 2000),
        updatedAt: BigInt(now + 2000),
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // Seed Artists
  console.log('🎨 Seeding artists...');
  const artists = await Promise.all([
    prisma.artist.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440010',
        name: 'Queen',
        grammy: true,
      },
    }),
    prisma.artist.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440011',
        name: 'The Beatles',
        grammy: true,
      },
    }),
    prisma.artist.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440012',
        name: 'Pink Floyd',
        grammy: true,
      },
    }),
    prisma.artist.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440013',
        name: 'Led Zeppelin',
        grammy: false,
      },
    }),
    prisma.artist.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440014',
        name: 'Arctic Monkeys',
        grammy: false,
      },
    }),
  ]);
  console.log(`✅ Created ${artists.length} artists`);

  // Seed Albums
  console.log('💽 Seeding albums...');
  const albums = await Promise.all([
    prisma.album.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440020',
        name: 'Innuendo',
        year: 1991,
        artistId: '550e8400-e29b-41d4-a716-446655440010', // Queen
      },
    }),
    prisma.album.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440021',
        name: 'A Night at the Opera',
        year: 1975,
        artistId: '550e8400-e29b-41d4-a716-446655440010', // Queen
      },
    }),
    prisma.album.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440022',
        name: 'Abbey Road',
        year: 1969,
        artistId: '550e8400-e29b-41d4-a716-446655440011', // The Beatles
      },
    }),
    prisma.album.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440023',
        name: 'The Dark Side of the Moon',
        year: 1973,
        artistId: '550e8400-e29b-41d4-a716-446655440012', // Pink Floyd
      },
    }),
    prisma.album.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440024',
        name: 'Led Zeppelin IV',
        year: 1971,
        artistId: '550e8400-e29b-41d4-a716-446655440013', // Led Zeppelin
      },
    }),
    prisma.album.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440025',
        name: 'AM',
        year: 2013,
        artistId: '550e8400-e29b-41d4-a716-446655440014', // Arctic Monkeys
      },
    }),
    prisma.album.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440026',
        name: 'Single Track Album',
        year: 2023,
        artistId: null, // Album with no artist
      },
    }),
  ]);
  console.log(`✅ Created ${albums.length} albums`);

  // Seed Tracks
  console.log('🎵 Seeding tracks...');
  const tracks = await Promise.all([
    prisma.track.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440030',
        name: 'The Show Must Go On',
        duration: 262,
        artistId: '550e8400-e29b-41d4-a716-446655440010', // Queen
        albumId: '550e8400-e29b-41d4-a716-446655440020', // Innuendo
      },
    }),
    prisma.track.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440031',
        name: 'Bohemian Rhapsody',
        duration: 355,
        artistId: '550e8400-e29b-41d4-a716-446655440010', // Queen
        albumId: '550e8400-e29b-41d4-a716-446655440021', // A Night at the Opera
      },
    }),
    prisma.track.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440032',
        name: 'Come Together',
        duration: 260,
        artistId: '550e8400-e29b-41d4-a716-446655440011', // The Beatles
        albumId: '550e8400-e29b-41d4-a716-446655440022', // Abbey Road
      },
    }),
    prisma.track.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440033',
        name: 'Time',
        duration: 421,
        artistId: '550e8400-e29b-41d4-a716-446655440012', // Pink Floyd
        albumId: '550e8400-e29b-41d4-a716-446655440023', // The Dark Side of the Moon
      },
    }),
    prisma.track.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440034',
        name: 'Stairway to Heaven',
        duration: 482,
        artistId: '550e8400-e29b-41d4-a716-446655440013', // Led Zeppelin
        albumId: '550e8400-e29b-41d4-a716-446655440024', // Led Zeppelin IV
      },
    }),
    prisma.track.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440035',
        name: 'Do I Wanna Know?',
        duration: 273,
        artistId: '550e8400-e29b-41d4-a716-446655440014', // Arctic Monkeys
        albumId: '550e8400-e29b-41d4-a716-446655440025', // AM
      },
    }),
    prisma.track.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440036',
        name: 'Another One Bites the Dust',
        duration: 215,
        artistId: '550e8400-e29b-41d4-a716-446655440010', // Queen
        albumId: null, // Track with no album
      },
    }),
    prisma.track.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440037',
        name: 'Independent Track',
        duration: 180,
        artistId: null, // Track with no artist
        albumId: null, // Track with no album
      },
    }),
  ]);
  console.log(`✅ Created ${tracks.length} tracks`);

  // Seed Favorites
  console.log('⭐ Seeding favorites...');
  const favorites = await prisma.favorites.create({
    data: {
      id: 'singleton',
      artists: [
        '550e8400-e29b-41d4-a716-446655440010', // Queen
        '550e8400-e29b-41d4-a716-446655440012', // Pink Floyd
      ],
      albums: [
        '550e8400-e29b-41d4-a716-446655440021', // A Night at the Opera
        '550e8400-e29b-41d4-a716-446655440023', // The Dark Side of the Moon
      ],
      tracks: [
        '550e8400-e29b-41d4-a716-446655440031', // Bohemian Rhapsody
        '550e8400-e29b-41d4-a716-446655440033', // Time
        '550e8400-e29b-41d4-a716-446655440034', // Stairway to Heaven
      ],
    },
  });
  console.log(`✅ Created favorites with ${favorites.artists.length} artists, ${favorites.albums.length} albums, ${favorites.tracks.length} tracks`);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`👥 Users: ${users.length}`);
  console.log(`🎨 Artists: ${artists.length}`);
  console.log(`💽 Albums: ${albums.length}`);
  console.log(`🎵 Tracks: ${tracks.length}`);
  console.log(`⭐ Favorites: 1 (with ${favorites.artists.length + favorites.albums.length + favorites.tracks.length} items)`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });