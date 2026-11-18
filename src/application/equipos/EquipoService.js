import { crearAsignacion, crearEquipo } from '../../domain/equipo/Equipo.js'
import { ErrorConflicto, ErrorNoEncontrado } from '../../shared/errors.js'

export function crearEquipoService(equipoRepositorio, jugadorRepositorio) {
  async function buscarEquipo(id) {
    const equipo = await equipoRepositorio.buscarPorId(id)
    if (!equipo) {
      throw new ErrorNoEncontrado('No existe un equipo con ese identificador.')
    }
    return equipo
  }

  async function verificarDuplicados(equipo, idActual = null) {
    const duplicados = await equipoRepositorio.buscarDuplicado(equipo.nombre, equipo.etiqueta)
    const otros = duplicados.filter((existente) => existente.id !== idActual)

    if (otros.some((e) => e.nombre.toLowerCase() === equipo.nombre.toLowerCase())) {
      throw new ErrorConflicto('Ya existe un equipo con ese nombre.')
    }
    if (otros.some((e) => e.etiqueta.toLowerCase() === equipo.etiqueta.toLowerCase())) {
      throw new ErrorConflicto('Ya existe un equipo con esa etiqueta.')
    }
  }

  async function obtener(id) {
    const equipo = await buscarEquipo(id)
    const integrantes = await equipoRepositorio.listarIntegrantes(id)
    return { ...equipo, integrantes }
  }

  return {
    listar() {
      return equipoRepositorio.listar()
    },

    obtener,

    async crear(datos) {
      const equipo = crearEquipo(datos)
      await verificarDuplicados(equipo)
      const creado = await equipoRepositorio.crear(equipo)
      return { ...creado, integrantes: [] }
    },

    async actualizar(id, datos) {
      await buscarEquipo(id)
      const equipo = crearEquipo(datos)
      await verificarDuplicados(equipo, id)

      const integrantes = await equipoRepositorio.listarIntegrantes(id)
      if (integrantes.some((integrante) => integrante.servidor !== equipo.region)) {
        throw new ErrorConflicto(
          'No se puede cambiar la región: hay integrantes de otro servidor. Quítalos primero.'
        )
      }

      await equipoRepositorio.actualizar(id, equipo)
      return obtener(id)
    },

    async eliminar(id) {
      await buscarEquipo(id)
      await equipoRepositorio.eliminar(id)
    },

    async asignarJugador(equipoId, datos) {
      const equipo = await buscarEquipo(equipoId)
      const { jugadorId, posicion } = crearAsignacion(datos)

      const jugador = await jugadorRepositorio.buscarPorId(jugadorId)
      if (!jugador) {
        throw new ErrorNoEncontrado('No existe un jugador con ese identificador.')
      }

      if (jugador.servidor !== equipo.region) {
        throw new ErrorConflicto(
          `${jugador.nombre} juega en ${jugador.servidor} y el equipo es de ${equipo.region}.`
        )
      }

      const asignacionActual = await equipoRepositorio.buscarAsignacionDeJugador(jugadorId)
      if (asignacionActual) {
        throw new ErrorConflicto(
          `${jugador.nombre} ya pertenece al equipo ${asignacionActual.equipoNombre} como ${asignacionActual.posicion}.`
        )
      }

      const ocupante = await equipoRepositorio.buscarOcupante(equipoId, posicion)
      if (ocupante) {
        throw new ErrorConflicto(`La posición ${posicion} ya está ocupada por ${ocupante.nombre}.`)
      }

      await equipoRepositorio.asignar(equipoId, jugadorId, posicion)
      return obtener(equipoId)
    },

    async quitarJugador(equipoId, jugadorId) {
      await buscarEquipo(equipoId)
      const quitado = await equipoRepositorio.quitar(equipoId, jugadorId)
      if (!quitado) {
        throw new ErrorNoEncontrado('Ese jugador no pertenece a este equipo.')
      }
      return obtener(equipoId)
    },
  }
}