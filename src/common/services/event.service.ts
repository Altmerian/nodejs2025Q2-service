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
  emitArtistDeleted(event: ArtistDeletedEvent): void {
    this.eventEmitter.emit(EVENTS.ARTIST.DELETED, event);
  }

  /**
   * Emit an event when an album is deleted
   * @param event - Album deleted event data
   */
  emitAlbumDeleted(event: AlbumDeletedEvent): void {
    this.eventEmitter.emit(EVENTS.ALBUM.DELETED, event);
  }

  /**
   * Emit an event when a track is deleted
   * @param event - Track deleted event data
   */
  emitTrackDeleted(event: TrackDeletedEvent): void {
    this.eventEmitter.emit(EVENTS.TRACK.DELETED, event);
  }

  /**
   * Get the underlying EventEmitter2 instance for advanced usage
   * @returns EventEmitter2 instance
   */
  getEmitter(): EventEmitter2 {
    return this.eventEmitter;
  }
}
