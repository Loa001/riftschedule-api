import 'dotenv/config'
import { crearApp } from './app.js'

const PORT = process.env.PORT || 3000

crearApp().listen(PORT, () => {
  console.log(`API de RiftSchedule escuchando en http://localhost:${PORT}`)
})