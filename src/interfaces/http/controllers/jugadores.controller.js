import { ErrorValidacion } from '../../../shared/errors.js'

function leerId(req) {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    throw new ErrorValidacion({ id: 'El identificador debe ser un número entero positivo.' })
  }
  return id
}

export function crearJugadoresController(servicio) {
  return {
    async listar(req, res) {
      res.json(await servicio.listar())
    },

    async obtener(req, res) {
      res.json(await servicio.obtener(leerId(req)))
    },

    async crear(req, res) {
      const jugador = await servicio.registrar(req.body)
      res.status(201).json(jugador)
    },

    async actualizar(req, res) {
      res.json(await servicio.actualizar(leerId(req), req.body))
    },

    async eliminar(req, res) {
      await servicio.eliminar(leerId(req))
      res.status(204).end()
    },

    async iniciarSesion(req, res) {
      res.json(await servicio.iniciarSesion(req.body?.riotId))
    },
  }
}