import { expect, use } from 'chai'
import { optional, schemaMatcher } from '../../testing-utils/src/chai-helpers.js'

use(schemaMatcher)

export const sessionDetailsSchema = {
  id: value => expect(value).to.be.a('string').and.not.be.empty,
  title: value => expect(value).to.be.a('string').and.not.be.empty,
  day: optional(value => expect(value).to.be.a('string').and.not.be.empty),
  room: optional(value => expect(value).to.be.a('string').and.not.be.empty),
  tags: value => expect(value).to.be.an('array') && value.forEach(it => expect(it).to.matchSchema(tagSchema)),
  attendees: value => expect(value).to.be.an('array') && value.forEach(it => expect(it).to.matchSchema(attendeeSchema)),
  startTime: optional(value => expect(value).to.be.a('string').and.match(/^\d\d:\d\d$/)),
  sessionFormat: optional(value => expect(value).to.be.a('string').and.not.be.empty),
}

const tagSchema = {
  label: value => expect(value).to.be.a('string'),
  color: value => expect(value).to.be.a('string'),
}

const attendeeSchema = {
  name: value => expect(value).to.be.a('string'),
  initials: value => expect(value).to.be.a('string').and.match(/^[A-Z]{2,3}$/),
}

