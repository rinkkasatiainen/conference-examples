import {ReminderSender} from '../src/reminder-sender/reminder-sender.js'

describe('reminder-sender', () => {
    it.skip('sends reminders quickly', async () => {
        const reminderSender = new ReminderSender()

        await reminderSender.sendAll([{id: '1', email: 'foo@example.com', sendAt: 1}])
    }).timeout(500)
})