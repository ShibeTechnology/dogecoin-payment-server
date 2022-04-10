const express = require('express')
const api = require('./api')
const admin = require('./admin')
const Configuration = require('./configuration')

module.exports = function (args = {}) {
  const config = new Configuration(args)
  const app = express()

  // Because we wnat config accessible everywhere!
  // TODO: do the same for logging and rpc
  app.locals.config = config

  app.use('/api/v1', api)
  app.use('/admin', admin)

  return app
}
