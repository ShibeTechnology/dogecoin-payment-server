const level = require('level')

class Database {
    constructor() {
        this.data = level('paymentchannel')
    }

    savePaymentChannel (pc) {

    }

    updatePaymentChannel () {

    }
}

module.exports = Database
