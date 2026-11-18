-- Jugadores registrados en RiftSchedule
CREATE TABLE IF NOT EXISTS jugadores (
  id         SERIAL PRIMARY KEY,
  nombre     VARCHAR(30) NOT NULL,
  riot_id    VARCHAR(30) NOT NULL,
  posicion   VARCHAR(10) NOT NULL CHECK (posicion IN ('Top', 'Jungla', 'Mid', 'ADC', 'Support')),
  servidor   VARCHAR(5)  NOT NULL CHECK (servidor IN ('LAN', 'LAS')),
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Un Riot ID no puede repetirse (sin importar mayúsculas)
CREATE UNIQUE INDEX IF NOT EXISTS jugadores_riot_id_unico ON jugadores (LOWER(riot_id));

-- Equipos
CREATE TABLE IF NOT EXISTS equipos (
  id         SERIAL PRIMARY KEY,
  nombre     VARCHAR(30) NOT NULL,
  etiqueta   VARCHAR(5)  NOT NULL,
  region     VARCHAR(5)  NOT NULL CHECK (region IN ('LAN', 'LAS')),
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS equipos_nombre_unico   ON equipos (LOWER(nombre));
CREATE UNIQUE INDEX IF NOT EXISTS equipos_etiqueta_unica ON equipos (LOWER(etiqueta));

-- Relación equipo-jugador: quién ocupa cada posición
CREATE TABLE IF NOT EXISTS equipo_jugadores (
  equipo_id   INTEGER NOT NULL REFERENCES equipos(id)   ON DELETE CASCADE,
  jugador_id  INTEGER NOT NULL REFERENCES jugadores(id) ON DELETE CASCADE,
  posicion    VARCHAR(10) NOT NULL CHECK (posicion IN ('Top', 'Jungla', 'Mid', 'ADC', 'Support')),
  PRIMARY KEY (equipo_id, posicion),
  UNIQUE (jugador_id)
);