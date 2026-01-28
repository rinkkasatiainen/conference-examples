import {expect} from 'chai'
import {ScheduleConverter} from '../src/schedule-converter/schedule-converter.js'

describe('schedule-converter', () => {
    it.skip('prints as Markdown', async () => {
        const scheduleConverter = new ScheduleConverter()

        const result = await scheduleConverter.convertToText()

        expect(result).to.eql(`# Conference Schedule

* 1 – Example Keynote (Unknown Speaker) in TBD room
* 2 – Example workshop (Unknown Speaker) in TBD room
`)
    })
})