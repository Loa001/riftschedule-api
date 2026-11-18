import { Router } from 'express'

export function crearJugadoresRouter(controlador) {
  const router = Router()

  router.get('/', controlador.listar)
  router.post('/', controlador.crear)
  router.post('/sesion', controlador.iniciarSesion)
  router.get('/:id', controlador.obtener)
  router.put('/:id', controlador.actualizar)
  router.delete('/:id', controlador.eliminar)

  return router
}