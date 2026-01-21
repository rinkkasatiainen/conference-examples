export class FeedbackSensor {
  // Simulate an unreliable external device / service
  readScores(): number[] | null {
    const outcome = Math.random();

    if (outcome < 0.05) {
      // 5%: simulate total failure
      throw new Error('Sensor failure');
    }

    if (outcome < 0.1) {
      // 5%: simulate returning nothing
      return null;
    }

    const length = 1 + Math.floor(Math.random() * 5);
    const scores: number[] = [];

    for (let i = 0; i < length; i += 1) {
      const score = 1 + Math.floor(Math.random() * 5);
      scores.push(score);
    }

    return scores;
  }
}
