import { crearJugador } from '../../domain/jugador/Jugador.js'
import { ErrorConflicto, ErrorNoEncontrado, ErrorValidacion } from '../../shared/errors.js'

export function crearJugadorService(repositorio) {
  async function obtener(id) {
    const jugador = await repositorio.buscarPorId(id)
    if (!jugador) {
      throw new ErrorNoEncontrado('No existe un jugador con ese identificador.')
    }
    return jugador
  }

  async function verificarRiotIdDisponible(riotId, idActual = null) {
    const existente = await repositorio.buscarPorRiotId(riotId)
    if (existente && existente.id !== idActual) {
      throw new ErrorConflicto('Ya existe un jugador registrado con ese Riot ID.')
    }
  }

  return {
    listar() {
      return repositorio.listar()
    },

    obtener,

    async registrar(datos) {
      const jugador = crearJugador(datos)
      await verificarRiotIdDisponible(jugador.riotId)
      return repositorio.crear(jugador)
    },

    async actualizar(id, datos) {
      await obtener(id)
      const jugador = crearJugador(datos)
      await verificarRiotIdDisponible(jugador.riotId, id)
      return repositorio.actualizar(id, jugador)
    },

    async eliminar(id) {
      await obtener(id)
      await repositorio.eliminar(id)
    },

    async iniciarSesion(riotId) {
      const valor = String(riotId ?? '').trim()
      if (!valor) {
        throw new ErrorValidacion({ riotId: 'Ingresa tu Riot ID.' })
      }
      const jugador = await repositorio.buscarPorRiotId(valor)
      if (!jugador) {
        throw new ErrorNoEncontrado('No hay un jugador registrado con ese Riot ID.')
      }
      return jugador
    },
  }
}