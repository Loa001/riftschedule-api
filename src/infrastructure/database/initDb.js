import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pool } from './pool.js'

const sql = await readFile(join(import.meta.dirname, 'schema.sql'), 'utf8')

try {
  await pool.query(sql)
  console.log('Tablas creadas correctamente en la base de datos.')
} catch (error) {
  console.error('Error al crear las tablas:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}