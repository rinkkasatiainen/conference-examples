import { badgeSequence } from './badge-sequence.js';
import { Badge } from './badge.js';

// Legacy-style dispenser tightly coupled to the global sequence.
export class BadgeDispenser {
  createBadge(name: string, pronouns: string): Badge {
    const id = badgeSequence.nextId();
    const formattedId = `CONF-${id}`;
    return new Badge(formattedId, name, pronouns);
  }
}
