
/*
    Payment Message Errors classes
*/

class NotValidMessageError extends Error {
  constructor () {
    super('Not valid message.')
    this.name = 'NotValidError'
    this.status = 400
    this.code = 201 // Error code in hex to avoid confusion with status ?
  }
}

module.exports = {
  NotValidMessageError
}
