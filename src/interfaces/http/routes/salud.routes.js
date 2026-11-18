import { Router } from 'express'
import { pool } from '../../../infrastructure/database/pool.js'

export const saludRouter = Router()

saludRouter.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT NOW() AS hora')
  res.json({ estado: 'ok', baseDeDatos: 'conectada', hora: rows[0].hora })
})