
class Configuration {
  constructor (args) {
    this.rpc = {
      user: args.rpcUser || process.env.RPC_USER,
      password: args.rpcPassword || process.env.RPC_PASSWORD,
      url: args.rpcUrl || process.env.RPC_URL,
      port: args.rpcPort || process.env.RPC_PORT
    }
    this.privateKey = args.privateKey || process.env.PRIVATE_KEY

    if (!this.rpc.user) {
      throw new Error('Missing `RPC_USER` environment variable.')
    }

    if (!this.rpc.password) {
      throw new Error('Missing `RPC_PASSWORD` environment variable.')
    }

    if (!this.rpc.url) {
      throw new Error('Missing `RPC_URL` environment variable.')
    }

    if (!this.rpc.port) {
      throw new Error('Missing `RPC_PORT` environment variable.')
    }

    if (!this.privateKey) {
      throw new Error('Missing `PRIVATE_KEY` environment variable.')
    }
  }
}

module.exports = Configuration
