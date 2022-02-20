const { format, createLogger, transports } = require('winston')

const customFormat = format.combine(
  format.colorize({ colors: { info: 'blue' } }),
  format.timestamp(),
  format.padLevels(),
  format.splat(),
  format.printf(log => `${log.timestamp} -\x1b[33m ${log.service.toUpperCase()} \x1b[J ${log.level}: ${log.message}`)
)

const logger = createLogger({
  format: customFormat,
  defaultMeta: { service: 'dogecoin-payment-server' },
  transports: [new transports.Console()]
})

// We want a singleton of it
Object.freeze(logger)
module.exports = logger
