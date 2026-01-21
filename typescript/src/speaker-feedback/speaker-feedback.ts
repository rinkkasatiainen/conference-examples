import {FeedbackSensor} from './feedback-sensor.js';

type SpeakerStatus = 'ALERT' | 'BOOK_AGAIN' | 'OK';

type EvaluationResult = {
  status: SpeakerStatus;
  averageScore: number | null;
};

// Legacy-style service that talks directly to the real sensor
// and hard-codes thresholds and retry logic.
export class SpeakerFeedbackService {
  private _sensor: FeedbackSensor;
  private _alertThreshold: number;
  private _bookAgainThreshold: number;

  constructor() {
    this._sensor = new FeedbackSensor();
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
  evaluateSpeaker(): EvaluationResult {
    const scores = this._sensor.readScores();

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
}
