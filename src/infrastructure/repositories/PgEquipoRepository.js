import { pool } from '../database/pool.js'

const COLUMNAS = `e.id, e.nombre, e.etiqueta, e.region, e.creado_en AS "creadoEn"`

export const equipoRepository = {
  async listar() {
    const { rows } = await pool.query(
      `SELECT ${COLUMNAS}, COUNT(ej.jugador_id)::int AS "totalIntegrantes"
       FROM equipos e
       LEFT JOIN equipo_jugadores ej ON ej.equipo_id = e.id
       GROUP BY e.id
       ORDER BY e.creado_en DESC`
    )
    return rows
  },

  async buscarPorId(id) {
    const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM equipos e WHERE e.id = $1`, [id])
    return rows[0] ?? null
  },

  async buscarDuplicado(nombre, etiqueta) {
    const { rows } = await pool.query(
      `SELECT ${COLUMNAS} FROM equipos e
       WHERE LOWER(e.nombre) = LOWER($1) OR LOWER(e.etiqueta) = LOWER($2)`,
      [nombre, etiqueta]
    )
    return rows
  },

  async crear({ nombre, etiqueta, region }) {
    const { rows } = await pool.query(
      `INSERT INTO equipos (nombre, etiqueta, region)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, etiqueta, region, creado_en AS "creadoEn"`,
      [nombre, etiqueta, region]
    )
    return rows[0]
  },

  async actualizar(id, { nombre, etiqueta, region }) {
    const { rows } = await pool.query(
      `UPDATE equipos SET nombre = $1, etiqueta = $2, region = $3
       WHERE id = $4
       RETURNING id, nombre, etiqueta, region, creado_en AS "creadoEn"`,
      [nombre, etiqueta, region, id]
    )
    return rows[0] ?? null
  },

  async eliminar(id) {
    const { rowCount } = await pool.query('DELETE FROM equipos WHERE id = $1', [id])
    return rowCount > 0
  },

  async listarIntegrantes(equipoId) {
    const { rows } = await pool.query(
      `SELECT ej.posicion, j.id AS "jugadorId", j.nombre, j.riot_id AS "riotId", j.servidor
       FROM equipo_jugadores ej
       JOIN jugadores j ON j.id = ej.jugador_id
       WHERE ej.equipo_id = $1
       ORDER BY array_position(ARRAY['Top', 'Jungla', 'Mid', 'ADC', 'Support'], ej.posicion)`,
      [equipoId]
    )
    return rows
  },

  async buscarAsignacionDeJugador(jugadorId) {
    const { rows } = await pool.query(
      `SELECT ej.equipo_id AS "equipoId", ej.posicion, e.nombre AS "equipoNombre"
       FROM equipo_jugadores ej
       JOIN equipos e ON e.id = ej.equipo_id
       WHERE ej.jugador_id = $1`,
      [jugadorId]
    )
    return rows[0] ?? null
  },

  async buscarOcupante(equipoId, posicion) {
    const { rows } = await pool.query(
      `SELECT j.id, j.nombre
       FROM equipo_jugadores ej
       JOIN jugadores j ON j.id = ej.jugador_id
       WHERE ej.equipo_id = $1 AND ej.posicion = $2`,
      [equipoId, posicion]
    )
    return rows[0] ?? null
  },

  async asignar(equipoId, jugadorId, posicion) {
    await pool.query(
      'INSERT INTO equipo_jugadores (equipo_id, jugador_id, posicion) VALUES ($1, $2, $3)',
      [equipoId, jugadorId, posicion]
    )
  },

  async quitar(equipoId, jugadorId) {
    const { rowCount } = await pool.query(
      'DELETE FROM equipo_jugadores WHERE equipo_id = $1 AND jugador_id = $2',
      [equipoId, jugadorId]
    )
    return rowCount > 0
  },
}