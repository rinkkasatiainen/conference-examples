type Room = {
  id: string;
  [key: string]: unknown;
};

// Singleton-style global registry with shared mutable state.
export class RoomRegistry {
  private _rooms: Map<string, Room>;
  private _reservations: Map<string, Set<string>>; // key: roomId, value: Set of timeSlot strings

  constructor() {
    this._rooms = new Map();
    this._reservations = new Map();
  }

  register(room: Room): void {
    if (!room || !room.id) {
      throw new Error('Room must have an id');
    }

    this._rooms.set(room.id, room);
  }

  reserve(roomId: string, timeSlot: string | number): void {
    if (!this._rooms.has(roomId)) {
      throw new Error(`Room not found: ${roomId}`);
    }

    const existing = this._reservations.get(roomId) || new Set<string>();
    existing.add(String(timeSlot));
    this._reservations.set(roomId, existing);
  }

  isAvailable(roomId: string, timeSlot: string | number): boolean {
    const existing = this._reservations.get(roomId);
    if (!existing) return true;
    return !existing.has(String(timeSlot));
  }
}

export const roomRegistry = new RoomRegistry();
