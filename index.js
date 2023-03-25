const config = require('./src/configuration')
const logger = require('./src/logging')
const app = require('./src/index')

module.exports = app.start(config, logger)
