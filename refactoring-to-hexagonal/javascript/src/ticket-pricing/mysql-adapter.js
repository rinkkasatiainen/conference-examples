import {readFile} from 'fs/promises';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class MysqlAdapter {
  constructor() {
    this._dataPath = join(__dirname, 'ticket-data.json');
    this._data = null;
  }

  async _loadData() {
    if (this._data === null) {
      const raw = await readFile(this._dataPath, 'utf8');
      this._data = JSON.parse(raw);
    }
    return this._data;
  }

  async _delay() {
    return new Promise((resolve) => setTimeout(resolve, 3000));
  }

  async query(sql, params = []) {
    // Simulate slow database query
    await this._delay();

    const data = await this._loadData();

    // Handle INSERT ... ON DUPLICATE KEY UPDATE
    if (sql.includes('INSERT INTO') && sql.includes('ON DUPLICATE KEY UPDATE')) {
      const typeMatch = sql.match(/`base_price`/);
      if (typeMatch && params.length >= 2) {
        const [type, cost] = params;
        if (!data.base_price) {
          data.base_price = [];
        }
        const existing = data.base_price.find((p) => p.type === type);
        if (existing) {
          existing.cost = cost;
        } else {
          data.base_price.push({type, cost});
        }
        // Note: In a real scenario, we'd write back to file, but for this exercise
        // we'll just keep it in memory
      }
      return [[], []];
    }

    // Handle SELECT cost FROM base_price WHERE type = ?
    if (sql.includes('SELECT cost FROM') && sql.includes('base_price') && sql.includes('WHERE')) {
      const type = params[0];
      const matching = data.base_price.find((p) => p.type === type);
      if (matching) {
        return [[{cost: matching.cost}], []];
      }
      return [[], []];
    }

    // Handle SELECT * FROM early_bird_dates
    if (sql.includes('SELECT * FROM') && sql.includes('early_bird_dates')) {
      const dates = data.early_bird_dates.map((row) => ({
        ...row,
        early_bird_date: new Date(row.early_bird_date)
      }));
      return [dates, []];
    }

    return [[], []];
  }
}

export async function createConnection(connectionOptions) {
  return new MysqlAdapter();
}
