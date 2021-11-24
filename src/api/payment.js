const networks = require('../networks');
const express = require('express');

const { PaymentMessage, PaymentMessageType } = require('./models/payment');
const { PaymentService } = require('../services/paymentservice');

const router = express.Router();
const pmtService = new PaymentService(networks.regtest, 1199);

router.post('/', (req, res) => {
  const keyPair = initKeyPair(process.env.PRIVATE_KEY);
  const pubkey = keyPair.publicKey.toString('hex');

  // check syntax of payment message we received
  const paymsg = PaymentMessage.fromObject(req.body);
  const syntaxVdn = paymsg.validate();
  if (!syntaxVdn.isOk()) {
    return res.status(400).send(syntaxVdn.toResponseObject())
  }

  // currently we only implement announcements
  if (paymsg.type !== PaymentMessageType.ANNOUNCE) {
    return res.status(402).send({
      status: "error",
      errors: ["not implemented:" + paymsg.type]
    });
  }

  // handle announcement
  const psbtVdn = pmtService.checkPSBT(pubkey, paymsg.psbt);
  return res.status(psbtVdn.isOk() ? 200 : 400).send(psbtVdn.toResponseObject());
});

module.exports = router;
