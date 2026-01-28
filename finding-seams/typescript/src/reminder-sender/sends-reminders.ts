type Reminder = {
  id: string;
  email: string;
  [key: string]: unknown;
};

const delay = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export class SendsReminders {
  // Real sleep that waits for the given time.
  async send(reminder: Reminder): Promise<void> {
    console.log(`Sending reminder ${reminder.id} to ${reminder.email}`);
    // Real sleeping between sends makes tests slow.
    await delay(1500);
  }
}

export const sendReminders = new SendsReminders();
