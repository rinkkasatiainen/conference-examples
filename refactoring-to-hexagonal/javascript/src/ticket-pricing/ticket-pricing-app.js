import express from 'express'
import {createConnection} from './mysql-adapter.js'

export async function createApp() {
  const app = express()
  app.use(express.json())

  const connectionOptions = {
    host: 'localhost',
    user: 'root',
    database: 'conference_db',
    password: 'mysql'
  }
  const connection = await createConnection(connectionOptions)

  app.put('/prices', async (req, res) => {
    const ticketCost = req.query.cost
    const ticketType = req.query.type
    await connection.query(
      'INSERT INTO `base_price` (type, cost) VALUES (?, ?) ' +
      'ON DUPLICATE KEY UPDATE cost = ?',
      [ticketType, ticketCost, ticketCost]
    )

    res.json()
  })

  app.get('/prices', async (req, res) => {
    const result = (await connection.query(
      'SELECT cost FROM `base_price` ' + 'WHERE `type` = ? ',
      [req.query.type]
    ))[0][0]

    if (req.query.type !== 'vip') {
      const earlyBirdDates = (await connection.query(
        'SELECT * FROM `early_bird_dates`'
      ))[0]

      let isEarlyBird = false
      let reduction = 0
      for (const row of earlyBirdDates) {
        const earlyBirdDate = row.early_bird_date
        if (req.query.date) {
          const d = new Date(req.query.date)
          if (
            d.getFullYear() === earlyBirdDate.getFullYear() &&
            d.getMonth() === earlyBirdDate.getMonth() &&
            d.getDate() === earlyBirdDate.getDate()
          ) {
            isEarlyBird = true
          }
        }
      }

      if (isEarlyBird) {
        reduction = 20
      }

      if (req.query.member === 'true') {
        reduction += 15
      }

      if (req.query.groupSize && req.query.groupSize >= 5) {
        reduction += 10
        const cost = result.cost * (1 - reduction / 100)
        res.json({cost: Math.ceil(cost)})
      } else {


        const dips = parseInt(req.query.dips) || 0
        if (dips >= 1) {
          if (dips <= 5) {
            reduction += 10
          } else {
            reduction += 25
          }
        }
        if (dips > 5) {
          reduction += 25
        }

        const includeSauna = req.query.includeSauna === 'true'
        if (!includeSauna && dips > 5) {
          reduction += 15
        }

        const cost = result.cost * (1 - reduction / 100)
        res.json({cost: Math.ceil(cost)})
      }
    } else {
      const includeSauna = req.query.includeSauna === 'true'

      if (includeSauna) {
        // VIP with sauna: add sauna fee
        const saunaFee = 50
        if (req.query.groupSize && req.query.groupSize >= 5) {
          const reduction = 10
          const cost = result.cost * (1 - reduction / 100)
          res.json({cost: Math.ceil(cost)})
        } else {
          res.json({cost: Math.ceil(result.cost + saunaFee)})
        }
      } else {
        res.json({cost: Math.ceil(cost)})
      }
    }
  })

  return {app, connection}
}
