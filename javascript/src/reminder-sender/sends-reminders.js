const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class SendsReminders {
  // Real sleep that waits for the given time.
  async send(reminder) {
    console.log(`Sending reminder ${reminder.id} to ${reminder.email}`);
    // Real sleeping between sends makes tests slow.
    await delay(1500);
  }
}

export const sendReminders = new SendsReminders();
