const RIPEMD160 = require('ripemd160')
const crypto = require('crypto')

function hashing (buf) {
  let hash = crypto.createHash('sha256').update(buf).digest()
  hash = new RIPEMD160().update(hash).digest()
  return hash
}

function doubleHash (data) {
  let hash = crypto.createHash('sha256').update(data).digest()
  hash = crypto.createHash('sha256').update(hash).digest()

  return hash
}

module.exports = { hashing, doubleHash }
