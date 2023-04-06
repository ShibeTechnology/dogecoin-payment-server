const app = require('./app')()

module.exports.start = (config, logger) => {
  logger.info('Starting payment channel server')

  // Start server
  const port = process.env.PORT || 5000
  app.listen(port, () => {
    logger.info(`Listening http://localhost:${port}`)

    // Ping node to verify if it is accessible
    app.locals.rpc.ping()
      .catch(function () {
        logger.error('Dogecoin node not available')
        process.exit(0)
      })
  })
}
