require('dotenv').config()

class Configuration {
  constructor () {
    this.rpc = {
      user: process.env.RPC_USER,
      password: process.env.RPC_PASSWORD,
      url: process.env.RPC_URL,
      port: process.env.RPC_PORT
    }
    this.privateKey = process.env.PRIVATE_KEY

    for (const [key, value] of Object.entries(this)) {
      if (!value) {
        throw new Error(`Missing RPC environment variable ${key}`)
      }
    }
  }
}

/**
 * Initialize global configuration
 */
const initGlobalConfig = () => {
  const config = new Configuration()
  return config
}

/**
 * Set configuration object
 */
module.exports = initGlobalConfig()
