import { readFile } from 'node:fs/promises';
import { ScheduleFormatter } from './schedule-formatter.js';

// Legacy-style converter that mixes file I/O, parsing, and formatting.
export class ScheduleConverter {
  private _formatter: ScheduleFormatter;
  private _defaultPath: URL;

  constructor() {
    this._formatter = new ScheduleFormatter();
    this._defaultPath = new URL('./schedule.json', import.meta.url);
  }

  async convertToText(): Promise<string> {
    const raw = await readFile(this._defaultPath, 'utf8');

    const scheduleObject = JSON.parse(raw);

    return this._formatter.format(scheduleObject);
  }
}
