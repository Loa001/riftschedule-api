export class ErrorAplicacion extends Error {
  constructor(mensaje, estado, detalles = null) {
    super(mensaje)
    this.estado = estado
    this.detalles = detalles
  }
}

export class ErrorValidacion extends ErrorAplicacion {
  constructor(detalles) {
    super('Los datos enviados no son válidos.', 400, detalles)
  }
}

export class ErrorNoEncontrado extends ErrorAplicacion {
  constructor(mensaje) {
    super(mensaje, 404)
  }
}

export class ErrorConflicto extends ErrorAplicacion {
  constructor(mensaje) {
    super(mensaje, 409)
  }
}