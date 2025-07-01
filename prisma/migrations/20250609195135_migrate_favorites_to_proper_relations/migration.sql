-- DropTable
DROP TABLE "favorites";

-- CreateTable
CREATE TABLE "favorite_artists" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,

    CONSTRAINT "favorite_artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_albums" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,

    CONSTRAINT "favorite_albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_tracks" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,

    CONSTRAINT "favorite_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "favorite_artists_artistId_key" ON "favorite_artists"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_albums_albumId_key" ON "favorite_albums"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_tracks_trackId_key" ON "favorite_tracks"("trackId");

-- AddForeignKey
ALTER TABLE "favorite_artists" ADD CONSTRAINT "favorite_artists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_albums" ADD CONSTRAINT "favorite_albums_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_tracks" ADD CONSTRAINT "favorite_tracks_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
