const secp256k1 = require('secp256k1')

function sign (message, privatekey) {
  let signature = secp256k1.ecdsaSign(message, privatekey)
  signature = secp256k1.signatureExport(signature.signature)
  return Buffer.from(signature)
}

function verify (signature, pubkey, message) {
  const sig = secp256k1.signatureImport(signature)
  const ok = secp256k1.ecdsaVerify(sig, message, pubkey)

  return ok
}

module.exports = { sign, verify }
