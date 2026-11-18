import express from 'express'
import cors from 'cors'
import { saludRouter } from './interfaces/http/routes/salud.routes.js'
import { manejarErrores } from './interfaces/http/middlewares/manejarErrores.js'

import { jugadorRepository } from './infrastructure/repositories/PgJugadorRepository.js'
import { equipoRepository } from './infrastructure/repositories/PgEquipoRepository.js'
import { crearJugadorService } from './application/jugadores/JugadorService.js'
import { crearEquipoService } from './application/equipos/EquipoService.js'
import { crearJugadoresController } from './interfaces/http/controllers/jugadores.controller.js'
import { crearEquiposController } from './interfaces/http/controllers/equipos.controller.js'
import { crearJugadoresRouter } from './interfaces/http/routes/jugadores.routes.js'
import { crearEquiposRouter } from './interfaces/http/routes/equipos.routes.js'

export function crearApp() {
  const app = express()

  const origenesPermitidos = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origen) => origen.trim())

  app.use(cors({ origin: origenesPermitidos }))
  app.use(express.json())

  // Composición de dependencias: repositorios → servicios → controladores → rutas
  const jugadorService = crearJugadorService(jugadorRepository)
  const equipoService = crearEquipoService(equipoRepository, jugadorRepository)

  app.use('/api/salud', saludRouter)
  app.use('/api/jugadores', crearJugadoresRouter(crearJugadoresController(jugadorService)))
  app.use('/api/equipos', crearEquiposRouter(crearEquiposController(equipoService)))

  app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada.' })
  })

  app.use(manejarErrores)

  return app
}