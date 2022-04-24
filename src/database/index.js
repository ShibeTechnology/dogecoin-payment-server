const level = require('level')

class Database {
  constructor () {
    this.paymentchannelDB = level('data/paymentchannel')
  }

  savePaymentChannel (address, data) {
    return this.paymentchannelDB.put(address, JSON.stringify(data))
  }

  updatePaymentChannelUTXO (address, txid, txout, state) {
    return this.paymentchannelDB.get(address)
      .then((value) => {
        const data = JSON.parse(value)
        data.utxo = { txid, txout }
        data.state = state

        return this.paymentchannelDB.put(address, JSON.stringify(data))
      })
  }

  updatePaymentChannelTransactions (address, tx) {
    return this.paymentchannelDB.get(address)
      .then((value) => {
        const data = JSON.parse(value)
        data.transactions.push(tx)

        return this.paymentchannelDB.put(address, JSON.stringify(data))
      })
  }

  updatePaymentChannelStatus (address, state) {
    return this.paymentchannelDB.get(address)
      .then((value) => {
        const data = JSON.parse(value)
        data.state = state

        return this.paymentchannelDB.put(address, JSON.stringify(data))
      })
  }

  async getAllPaymentChannels () {
    const paymentchannels = []
    for await (const value of this.paymentchannelDB.iterator()) {
      const pc = JSON.parse(value[1])
      pc.address = value[0]
      paymentchannels.push(pc)
    }

    return paymentchannels
  }

  getPaymentChannel (address) {
    return this.paymentchannelDB.get(address)
      .then(function (value) {
        return JSON.parse(value)
      })
      .catch(function (err) {
        if (err) {
          if (err.notFound) {
            // handle a 'NotFoundError' here
            return null
          }
        }
        throw err
      })
  }
}

const db = new Database()
// Singleton
Object.freeze(db)

module.exports = db
