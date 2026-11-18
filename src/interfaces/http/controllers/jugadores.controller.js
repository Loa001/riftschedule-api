import { leerId } from '../utils/parametros.js'

export function crearJugadoresController(servicio) {
  return {
    async listar(req, res) {
      res.json(await servicio.listar())
    },

    async obtener(req, res) {
      res.json(await servicio.obtener(leerId(req.params.id)))
    },

    async crear(req, res) {
      const jugador = await servicio.registrar(req.body)
      res.status(201).json(jugador)
    },

    async actualizar(req, res) {
      res.json(await servicio.actualizar(leerId(req.params.id), req.body))
    },

    async eliminar(req, res) {
      await servicio.eliminar(leerId(req.params.id))
      res.status(204).end()
    },

    async iniciarSesion(req, res) {
      res.json(await servicio.iniciarSesion(req.body?.riotId))
    },
  }
}