// Singleton-style global registry with shared mutable state.
export class RoomRegistry {
  constructor() {
    this._rooms = new Map();
    this._reservations = new Map(); // key: roomId, value: Set of timeSlot strings
  }

  register(room) {
    if (!room || !room.id) {
      throw new Error('Room must have an id');
    }

    this._rooms.set(room.id, room);
  }

  reserve(roomId, timeSlot) {
    if (!this._rooms.has(roomId)) {
      throw new Error(`Room not found: ${roomId}`);
    }

    const existing = this._reservations.get(roomId) || new Set();
    existing.add(String(timeSlot));
    this._reservations.set(roomId, existing);
  }

  isAvailable(roomId, timeSlot) {
    const existing = this._reservations.get(roomId);
    if (!existing) return true;
    return !existing.has(String(timeSlot));
  }
}

export const roomRegistry = new RoomRegistry();

