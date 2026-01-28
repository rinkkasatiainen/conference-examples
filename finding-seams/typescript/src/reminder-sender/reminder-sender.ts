import { sendReminders } from './sends-reminders.js';

type Reminder = {
  id: string;
  email: string;
  sendAt: Date | string | number;
};

// Reminder sender that mixes timing, throttling and business rules.
export class ReminderSender {
  // reminders: [{ id, email, sendAt: Date|string|number }]
  async sendAll(reminders: Reminder[]): Promise<void> {
    const now = Date.now();

    for (const reminder of reminders) {
      const sendAtTime = this._toTimestamp(reminder.sendAt);

      if (sendAtTime <= now) {
        await sendReminders.send(reminder);
      }
    }
  }

  private _toTimestamp(value: Date | string | number): number {
    if (value instanceof Date) {
      return value.getTime();
    }
    if (typeof value === 'number') {
      return value;
    }
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
    // Fallback to "now" for bad values.
    return Date.now();
  }
}
