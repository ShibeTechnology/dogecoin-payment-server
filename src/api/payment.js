const { Psbt, script, payments, networks } = require('bitcoinjs-lib');
const express = require('express');
const { jsonRPC } = require('../util');

const router = express.Router();

// const channel = require('./channel');

router.use('/', (req, res) => {
    let redeemscript = 'OP_IF 1200 OP_CHECKLOCKTIMEVERIFY OP_DROP 02695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c172 OP_CHECKSIGVERIFY OP_ELSE OP_2 OP_ENDIF 02695c71925215f8a23d9880fc52811c77aac00a259876046c8ad92731d8c2c172 033018856019108336a67b29f4cf9612b9b83953a92a5ef8472b6822f78d850477 OP_2 OP_CHECKMULTISIG'
    console.log(redeemscript)
    let expiry = redeemscript.match(`(?<=OP_IF ).*(?= OP_CHECKLOCKTIMEVERIFY)`)[0]
    console.log(expiry)
    let keyPairA = redeemscript.match(`(?<=OP_DROP ).*(?= OP_CHECKSIGVERIFY)`)[0]
    console.log(keyPairA)
    // let p2sh = payments.p2sh({
    //     redeem: { output: script.toASM(redeemscript) },
    //     network: networks.dogecoin_regtest
    // })
    // console.log(p2sh)
    console.log(p2sh.redeem.output.toString('hex'))
    // let p2sh = script.toASM(redeemscript);
    // check expiry data is good
    // check p2sh (query node, p2sh funded w tx)
    // confirm we now have a payment channel
    res.sendStatus(200)
});

router.get('/new', (req, res) => {
    let psbt2 = req.body['pbst'] ? '' : Psbt.fromHex(req.body['psbt'].toString());
    let redeemScript = script.toASM(psbt2.data.inputs[0].redeemScript)
    if (redeemScript.includes(process.env.PUBLIC_KEY)) {
        console.log(true)
    }
    // psbt2.data.inputs.map((k, v) => {
    //     console.log(k)
    //     console.log(v)
    //     for (v1 in psbt2) {
    //         console.log(v1)
    //     }
    // })
    
    // console.log(psbt2.data.inputs[0].multisigScript['redeem'])
    // console.log(psbt2.inputHasPubkey(0, Buffer.from(psbt2.data.inputs[0].multisigScript, 'hex').toString()))
    // for (k in req.body) {
    //     !(k == 'tx') && !(k == 'signature') ? console.log('success') : console.log(`${k} not found`);
    // }
    // res.send(psbt2)
    res.sendStatus(200)
  });

module.exports = router;
