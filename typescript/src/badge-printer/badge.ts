export class Badge {
  id: string;
  name: string;
  pronouns: string;
  issuedAt: Date;
  randomSeed: number;

  constructor(id: string, name: string, pronouns: string, issuedAt: Date, randomSeed: number) {
    this.id = id;
    this.name = name;
    this.pronouns = pronouns;
    this.issuedAt = issuedAt;
    this.randomSeed = randomSeed;
  }
}
