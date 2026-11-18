import { leerId } from '../utils/parametros.js'

export function crearEquiposController(servicio) {
  return {
    async listar(req, res) {
      res.json(await servicio.listar())
    },

    async obtener(req, res) {
      res.json(await servicio.obtener(leerId(req.params.id)))
    },

    async crear(req, res) {
      res.status(201).json(await servicio.crear(req.body))
    },

    async actualizar(req, res) {
      res.json(await servicio.actualizar(leerId(req.params.id), req.body))
    },

    async eliminar(req, res) {
      await servicio.eliminar(leerId(req.params.id))
      res.status(204).end()
    },

    async asignarJugador(req, res) {
      const equipo = await servicio.asignarJugador(leerId(req.params.id), req.body)
      res.status(201).json(equipo)
    },

    async quitarJugador(req, res) {
      const equipo = await servicio.quitarJugador(
        leerId(req.params.id),
        leerId(req.params.jugadorId, 'jugadorId')
      )
      res.json(equipo)
    },
  }
}