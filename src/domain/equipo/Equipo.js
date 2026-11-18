import { ErrorValidacion } from '../../shared/errors.js'
import { POSICIONES, SERVIDORES } from '../jugador/Jugador.js'

const ETIQUETA_REGEX = /^[A-Z0-9]{2,5}$/

export function crearEquipo(datos) {
  const equipo = {
    nombre: String(datos?.nombre ?? '').trim(),
    etiqueta: String(datos?.etiqueta ?? '').trim().toUpperCase(),
    region: datos?.region,
  }

  const errores = {}

  if (equipo.nombre.length < 3 || equipo.nombre.length > 30) {
    errores.nombre = 'El nombre del equipo debe tener entre 3 y 30 caracteres.'
  }
  if (!ETIQUETA_REGEX.test(equipo.etiqueta)) {
    errores.etiqueta = 'La etiqueta debe tener de 2 a 5 letras o números, sin espacios.'
  }
  if (!SERVIDORES.includes(equipo.region)) {
    errores.region = 'La región debe ser LAN o LAS.'
  }

  if (Object.keys(errores).length > 0) {
    throw new ErrorValidacion(errores)
  }

  return equipo
}

export function crearAsignacion(datos) {
  const asignacion = {
    jugadorId: Number(datos?.jugadorId),
    posicion: datos?.posicion,
  }

  const errores = {}

  if (!Number.isInteger(asignacion.jugadorId) || asignacion.jugadorId <= 0) {
    errores.jugadorId = 'Selecciona un jugador válido.'
  }
  if (!POSICIONES.includes(asignacion.posicion)) {
    errores.posicion = `La posición debe ser una de: ${POSICIONES.join(', ')}.`
  }

  if (Object.keys(errores).length > 0) {
    throw new ErrorValidacion(errores)
  }

  return asignacion
}