/**
 * Event constants for cascading operations
 */
export const EVENTS = {
  ARTIST: {
    DELETED: 'artist.deleted',
  },
  ALBUM: {
    DELETED: 'album.deleted',
  },
  TRACK: {
    DELETED: 'track.deleted',
  },
} as const;

/**
 * Type-safe event names
 */
export type EventName = typeof EVENTS.ARTIST.DELETED | typeof EVENTS.ALBUM.DELETED | typeof EVENTS.TRACK.DELETED;
