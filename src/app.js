import express from 'express'
import cors from 'cors'
import { saludRouter } from './interfaces/http/routes/salud.routes.js'
import { manejarErrores } from './interfaces/http/middlewares/manejarErrores.js'

export function crearApp() {
  const app = express()

  const origenesPermitidos = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origen) => origen.trim())

  app.use(cors({ origin: origenesPermitidos }))
  app.use(express.json())

  app.use('/api/salud', saludRouter)

  app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada.' })
  })

  app.use(manejarErrores)

  return app
}