import { ErrorValidacion } from '../../shared/errors.js'

export const POSICIONES = ['Top', 'Jungla', 'Mid', 'ADC', 'Support']
export const SERVIDORES = ['LAN', 'LAS']
export const RIOT_ID_REGEX = /^[^#]{3,16}#[A-Za-z0-9]{3,5}$/

export function crearJugador(datos) {
  const jugador = {
    nombre: String(datos?.nombre ?? '').trim(),
    riotId: String(datos?.riotId ?? '').trim(),
    posicion: datos?.posicion,
    servidor: datos?.servidor,
  }

  const errores = {}

  if (jugador.nombre.length < 3 || jugador.nombre.length > 30) {
    errores.nombre = 'El nombre debe tener entre 3 y 30 caracteres.'
  }
  if (!RIOT_ID_REGEX.test(jugador.riotId)) {
    errores.riotId = 'El Riot ID debe tener el formato Nombre#TAG.'
  }
  if (!POSICIONES.includes(jugador.posicion)) {
    errores.posicion = `La posición debe ser una de: ${POSICIONES.join(', ')}.`
  }
  if (!SERVIDORES.includes(jugador.servidor)) {
    errores.servidor = 'El servidor debe ser LAN o LAS.'
  }

  if (Object.keys(errores).length > 0) {
    throw new ErrorValidacion(errores)
  }

  return jugador
}