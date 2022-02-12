/*
    General Errors classes
*/

class MissingFieldError extends Error {
  constructor (field) {
    super(`Missing ${field} field.`)
    this.name = 'MissingFieldError'
    this.status = 400
  }
}

class NotImplementedError extends Error {
  constructor () {
    super('Not implemented.')
    this.name = 'NotImplementedError'
    this.status = 402
  }
}

module.exports = {
  MissingFieldError,
  NotImplementedError
}
