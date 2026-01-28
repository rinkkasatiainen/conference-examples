import {expect} from 'chai'
import {ReminderSender} from '../src/reminder-sender/reminder-sender.js'

describe('reminder-sender', () => {
  it.skip('sends reminders quickly', async () => {
    const reminderSender = new ReminderSender()

    const result = await reminderSender.sendAll([{id: '1', email: 'foo@example.com'}])

    expect(result).to.eql()
  }).timeout(500)
})