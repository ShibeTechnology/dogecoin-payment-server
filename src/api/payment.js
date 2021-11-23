const { Psbt, script, payments, networks, address } = require('bitcoinjs-lib');
const express = require('express');

const { PaymentMessage, PaymentMessageType } = require('./models/payment');
const { PaymentService } = require('../services/paymentservice');

const router = express.Router();
const pmtService = new PaymentService(networks.dogecoin_regtest, 1199);

const PUBKEY = "033018856019108336a67b29f4cf9612b9b83953a92a5ef8472b6822f78d850477";

router.post('/', (req, res) => {
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
  const psbtVdn = pmtService.checkPSBT(PUBKEY, paymsg.psbt);
  return res.status(psbtVdn.isOk() ? 200 : 400).send(psbtVdn.toResponseObject());
});

module.exports = router;
