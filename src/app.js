const express = require('express')
const api = require('./api')
const admin = require('./admin')
const Configuration = require('./configuration')
const RPC = require('./utils/rpc')

module.exports = function (args = {}) {
  const config = new Configuration(args)
  const app = express()

  // Because we wnat config accessible everywhere!
  // TODO: do the same for logging
  app.locals.config = config
  app.locals.rpc = new RPC(config.rpc)

  app.use('/api/v1', api)
  app.use('/admin', admin)

  return app
}
