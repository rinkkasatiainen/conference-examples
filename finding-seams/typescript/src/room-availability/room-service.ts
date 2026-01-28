import { roomRegistry } from './room-registry.js';

type PlacementResult = {
  sessionId: string;
  roomId: string;
  timeSlot: string | number;
  status: 'ACCEPTED' | 'REJECTED';
  reason?: string;
};

// Legacy-style service that talks directly to the global registry.
export class RoomService {
  placeSessionInRoom(
    sessionId: string,
    roomId: string,
    timeSlot: string | number,
  ): PlacementResult {
    if (!roomRegistry.isAvailable(roomId, timeSlot)) {
      return {
        sessionId,
        roomId,
        timeSlot,
        status: 'REJECTED',
        reason: 'Room not available',
      };
    }

    roomRegistry.reserve(roomId, timeSlot);

    return {
      sessionId,
      roomId,
      timeSlot,
      status: 'ACCEPTED',
    };
  }
}
