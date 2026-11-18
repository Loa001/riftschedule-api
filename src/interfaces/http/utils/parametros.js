import { ErrorValidacion } from '../../../shared/errors.js'

export function leerId(valor, campo = 'id') {
  const id = Number(valor)
  if (!Number.isInteger(id) || id <= 0) {
    throw new ErrorValidacion({ [campo]: 'El identificador debe ser un número entero positivo.' })
  }
  return id
}