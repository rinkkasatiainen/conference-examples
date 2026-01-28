import { badgeSequence } from './badge-sequence.js';
import { Badge } from './badge.js';

// Legacy-style dispenser tightly coupled to the global sequence.
export class BadgeDispenser {
  createBadge(name, pronouns) {
    const issuedAt = new Date();
    const randomSeed = Math.random();

    const id = badgeSequence.nextId();
    const formattedId = `CONF-${id}`;
    return new Badge(formattedId, name, pronouns, issuedAt, randomSeed);
  }
}

