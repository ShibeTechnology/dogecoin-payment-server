const { Psbt, script, payments, networks, address } = require('bitcoinjs-lib');
const express = require('express');

const { jsonRPC } = require('../util');
const { PaymentMessage } = require('./models/payment');

const router = express.Router();

function validate (addr) {
    try {
      address.toOutputScript(addr, networks.dogecoin_regtest)
      return true
    } catch (e) {
      return false
    }
  }
// const channel = require('./channel');
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

router.use('/', (req, res, next) => {
    // let redeemscript = 'OP_IF 1200 OP_CHECKLOCKTIMEVERIFY OP_DROP 02695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c172 OP_CHECKSIGVERIFY OP_ELSE OP_2 OP_ENDIF 02695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c172 033018856019108336a67b29f4cf9612b9b83953a92a5ef8472b6822f78d850477 OP_2 OP_CHECKMULTISIG'
    // console.log(redeemscript)
    // let expiry = redeemscript.match(`(?<=OP_IF ).*(?= OP_CHECKLOCKTIMEVERIFY)`)[0]
    // console.log('expiry: ', expiry)
    // let keyPairA = redeemscript.match(`(?<=OP_DROP ).*(?= OP_CHECKSIGVERIFY)`)[0]
    // console.log('keyPairA: ', keyPairA)
    // let redeemScript = script.fromASM(redeemscript)

    // const p2sh = payments.p2sh({ 
    //     redeem: { output : script.fromASM(redeemscript) },
    //     network: networks.dogecoin_regtest
    // })

    // // check redeeemscript is legit
    // jsonRPC('decodescript', [p2sh.output.toString('hex')])[0]['asm']

    // // verify  that p2sh is validated although according #890 (2019) doesn't support regtest address validation
    // console.log(validate(p2sh.address) ? false : true)
    // // check expiry data is good
    // // check p2sh (query node, p2sh funded w tx)
    // // confirm we now have a payment channel
    return next()
});

router.get('/new', (req, res) => {
    const paymsg = PaymentMessage.fromObject(req.body);
    const syntaxVdn = paymsg.validate();
    if (!syntaxVdn.isOk()) {
      return res.status(400).send(syntaxVdn.toResponseObject())
    }

    let flag = false
    let psbt2 = Psbt.fromHex(paymsg.psbt);
    console.log(psbt2)
    let redeemScript = script.toASM(psbt2.data.inputs[0].redeemScript)
    console.log(redeemScript)
    if (redeemScript.includes(process.env.PUBLIC_KEY)) {
        console.log(true)
        flag = true
    }
    console.log(flag)
    let expiry = redeemScript.match(`(?<=OP_IF ).*(?= OP_CHECKLOCKTIMEVERIFY)`)[0]
    console.log('expiry: ', expiry)
    let keyPairA = redeemScript.match(`(?<=OP_DROP ).*(?= OP_CHECKSIGVERIFY)`)[0]
    console.log('keyPairA: ', keyPairA)

    const p2sh = payments.p2sh({ 
        redeem: { output : script.fromASM(redeemScript) },
        network: networks.dogecoin_regtest
    })
    console.log(p2sh)
    console.log(p2sh.address)
    // check redeeemscript is legit
    let result = jsonRPC('decodescript', [p2sh.output.toString('hex')])
    console.log(result)
    flag = validate(p2sh.address)
    return res.send(flag)
  });

module.exports = router;
