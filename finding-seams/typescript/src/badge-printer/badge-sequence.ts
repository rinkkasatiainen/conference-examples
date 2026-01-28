// Global singleton-style sequence generator with hidden state.
export class BadgeSequence {
  private _current: number;

  constructor() {
    this._current = 0;
  }

  nextId(): number {
    this._current += 1;
    return this._current;
  }
}

export const badgeSequence = new BadgeSequence();
