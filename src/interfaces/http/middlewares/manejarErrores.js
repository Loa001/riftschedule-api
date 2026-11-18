import { ErrorAplicacion } from '../../../shared/errors.js'

export function manejarErrores(error, req, res, next) {
  if (error instanceof ErrorAplicacion) {
    return res.status(error.estado).json({
      mensaje: error.message,
      errores: error.detalles,
    })
  }

  console.error(error)
  res.status(500).json({ mensaje: 'Ocurrió un error interno en el servidor.' })
}