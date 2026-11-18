import { pool } from '../database/pool.js'

const COLUMNAS = `id, nombre, riot_id AS "riotId", posicion, servidor, creado_en AS "creadoEn"`

export const jugadorRepository = {
  async listar() {
    const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM jugadores ORDER BY creado_en DESC`)
    return rows
  },

  async buscarPorId(id) {
    const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM jugadores WHERE id = $1`, [id])
    return rows[0] ?? null
  },

  async buscarPorRiotId(riotId) {
    const { rows } = await pool.query(
      `SELECT ${COLUMNAS} FROM jugadores WHERE LOWER(riot_id) = LOWER($1)`,
      [riotId]
    )
    return rows[0] ?? null
  },

  async crear({ nombre, riotId, posicion, servidor }) {
    const { rows } = await pool.query(
      `INSERT INTO jugadores (nombre, riot_id, posicion, servidor)
       VALUES ($1, $2, $3, $4)
       RETURNING ${COLUMNAS}`,
      [nombre, riotId, posicion, servidor]
    )
    return rows[0]
  },

  async actualizar(id, { nombre, riotId, posicion, servidor }) {
    const { rows } = await pool.query(
      `UPDATE jugadores
       SET nombre = $1, riot_id = $2, posicion = $3, servidor = $4
       WHERE id = $5
       RETURNING ${COLUMNAS}`,
      [nombre, riotId, posicion, servidor, id]
    )
    return rows[0] ?? null
  },

  async eliminar(id) {
    const { rowCount } = await pool.query('DELETE FROM jugadores WHERE id = $1', [id])
    return rowCount > 0
  },
}