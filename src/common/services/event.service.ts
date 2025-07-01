import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '../constants/events';

export interface EntityDeletedEvent {
  id: string;
}

export type ArtistDeletedEvent = EntityDeletedEvent;
export type AlbumDeletedEvent = EntityDeletedEvent;
export type TrackDeletedEvent = EntityDeletedEvent;

@Injectable()
export class EventService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * Emit an event when an artist is deleted
   * @param event - Artist deleted event data
   */
  async emitArtistDeleted(event: ArtistDeletedEvent): Promise<void> {
    await this.eventEmitter.emitAsync(EVENTS.ARTIST.DELETED, event);
  }

  /**
   * Emit an event when an album is deleted
   * @param event - Album deleted event data
   */
  async emitAlbumDeleted(event: AlbumDeletedEvent): Promise<void> {
    await this.eventEmitter.emitAsync(EVENTS.ALBUM.DELETED, event);
  }

  /**
   * Emit an event when a track is deleted
   * @param event - Track deleted event data
   */
  async emitTrackDeleted(event: TrackDeletedEvent): Promise<void> {
    await this.eventEmitter.emitAsync(EVENTS.TRACK.DELETED, event);
  }

  /**
   * Get the underlying EventEmitter2 instance for advanced usage
   * @returns EventEmitter2 instance
   */
  getEmitter(): EventEmitter2 {
    return this.eventEmitter;
  }
}
