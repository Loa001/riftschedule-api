import express from 'express'
import cors from 'cors'
import { saludRouter } from './interfaces/http/routes/salud.routes.js'
import { manejarErrores } from './interfaces/http/middlewares/manejarErrores.js'

import { jugadorRepository } from './infrastructure/repositories/PgJugadorRepository.js'
import { crearJugadorService } from './application/jugadores/JugadorService.js'
import { crearJugadoresController } from './interfaces/http/controllers/jugadores.controller.js'
import { crearJugadoresRouter } from './interfaces/http/routes/jugadores.routes.js'

export function crearApp() {
  const app = express()

  const origenesPermitidos = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origen) => origen.trim())

  app.use(cors({ origin: origenesPermitidos }))
  app.use(express.json())

  // Composición de dependencias: repositorio → servicio → controlador → rutas
  const jugadorService = crearJugadorService(jugadorRepository)
  const jugadoresController = crearJugadoresController(jugadorService)

  app.use('/api/salud', saludRouter)
  app.use('/api/jugadores', crearJugadoresRouter(jugadoresController))

  app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada.' })
  })

  app.use(manejarErrores)

  return app
}