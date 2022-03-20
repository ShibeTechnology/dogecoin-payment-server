
/*
    Payment Message Errors classes
*/

class NotValidMessageError extends Error {
  constructor () {
    super('Not valid message.')
    this.name = 'NotValidError'
    this.status = 400
  }
}

module.exports = {
  NotValidMessageError
}
