const bs58check = require('bs58check')
const { hashing } = require('./hash')

function pubkeyToPubkeyHash (pubkey) {
  return hashing(pubkey)
}

function pubkeyToAddress (pubkey, networkByte, hash = false) {
  let pubKeyHash = pubkey

  if (!hash) {
    pubKeyHash = pubkeyToPubkeyHash(pubkey)
  }

  networkByte = Buffer.from([networkByte])

  const temp = Buffer.concat([networkByte, pubKeyHash])

  return bs58check.encode(temp)
}

function createPayToHash (script) {
  if (!Buffer.isBuffer(script)) {
    throw new Error('Script is expected to be a Buffer.')
  }

  const hashScript = hashing(script)

  return { script: Buffer.from('a9' + hashScript.length.toString(16) + hashScript.toString('hex') + '87', 'hex'), hashScript }
}

module.exports = {
  createPayToHash,
  pubkeyToAddress,
  pubkeyToPubkeyHash
}
