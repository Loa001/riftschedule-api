import { Router } from 'express'

export function crearEquiposRouter(controlador) {
  const router = Router()

  router.get('/', controlador.listar)
  router.post('/', controlador.crear)
  router.get('/:id', controlador.obtener)
  router.put('/:id', controlador.actualizar)
  router.delete('/:id', controlador.eliminar)
  router.post('/:id/integrantes', controlador.asignarJugador)
  router.delete('/:id/integrantes/:jugadorId', controlador.quitarJugador)

  return router
}