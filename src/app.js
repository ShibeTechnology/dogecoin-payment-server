const express = require('express')
const api = require('./api')
const admin = require('./admin')
const Configuration = require('./configuration')
const RPC = require('./utils/rpc')

module.exports = function () {
  const app = express()

  app.locals.config = Configuration
  app.locals.rpc = new RPC(Configuration.rpc)

  app.use('/api/v1', api)
  app.use('/admin', admin)

  return app
}
