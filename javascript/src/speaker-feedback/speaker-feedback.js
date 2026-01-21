import { FeedbackSensor } from './feedback-sensor.js';

export class SpeakerFeedbackService {
  constructor() {
    this._sensor = new FeedbackSensor();
    this._maxRetries = 3;
    this._alertThreshold = 2.5;
    this._bookAgainThreshold = 4.2;
  }

  /**
   * Collect scores from the unreliable sensor, retrying on failures,
   * and classify the speaker.
   *
   * Returns an object like:
   * { status: 'ALERT' | 'BOOK_AGAIN' | 'OK', averageScore: number | null }
   */
  evaluateSpeaker() {
    const scores = this._collectScoresWithRetries();

    if (!scores || scores.length === 0) {
      return {
        status: 'ALERT',
        averageScore: null,
      };
    }

    const validScores = scores.filter(
      (score) => typeof score === 'number' && score >= 1 && score <= 5,
    );

    if (validScores.length === 0) {
      return {
        status: 'ALERT',
        averageScore: null,
      };
    }

    const sum = validScores.reduce((acc, value) => acc + value, 0);
    const average = sum / validScores.length;

    if (average < this._alertThreshold) {
      return {
        status: 'ALERT',
        averageScore: average,
      };
    }

    if (average >= this._bookAgainThreshold) {
      return {
        status: 'BOOK_AGAIN',
        averageScore: average,
      };
    }

    return {
      status: 'OK',
      averageScore: average,
    };
  }

  _collectScoresWithRetries() {
    for (let attempt = 0; attempt < this._maxRetries; attempt += 1) {
      try {
        const scores = this._sensor.readScores();

        if (scores && Array.isArray(scores)) {
          return [...scores];
        }
      } catch (error) {
        // swallow and retry
      }
    }

    return [];
  }
}

