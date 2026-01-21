import { sendReminders } from './sends-reminders.js';

// Reminder sender that mixes timing, throttling and business rules.
export class ReminderSender {
  constructor() {
  }

  // reminders: [{ id, email, sendAt: Date|string|number }]
  async sendAll(reminders) {
    const now = Date.now();

    for (const reminder of reminders) {
      const sendAtTime = this._toTimestamp(reminder.sendAt);

      if (sendAtTime <= now) {
        await sendReminders.send(reminder);
      }
    }
  }

  _toTimestamp(value) {
    if (value instanceof Date) {
      return value.getTime();
    }
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = Date.parse(value);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
    // Fallback to "now" for bad values.
    return Date.now();
  }
}

