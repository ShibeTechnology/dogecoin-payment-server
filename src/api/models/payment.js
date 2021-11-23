const { Validator } = require('../../validation');

const PaymentMessageType = Object.create(null);
PaymentMessageType.ANNOUNCE = "announce";
PaymentMessageType.PAYMENT = "payment";

Object.defineProperty(PaymentMessageType, "values", {
  get: () => Object.values(PaymentMessageType),
  enumerable: false
});

class PaymentMessage {
  type;
  ref;
  psbt;

  constructor(type, ref, psbt) {
    this.type = type;
    this.ref = ref;
    this.psbt = psbt;
  }

  validate() { // Returns ValidationResult
    const validator = new Validator();
    try {
      validator.test(this.type, (d) => typeof d === "string",
                     "type needs to be a string");
      validator.test(this.type, (d) => PaymentMessageType.values.indexOf(d) !== -1,
                     "type needs to be one of " + PaymentMessageType.values.join(","));
      validator.test(this.psbt, (d) => typeof d === "string",
                     "psbtHex needs to be a string");
      validator.test(this.psbt, (d) => Buffer.from(d, "hex").length == d.length / 2,
                     "psbt needs to be a hexadecimal string");
    } catch (e) {
      validator.caught(e);
    }

    return validator.result;
  }

}

PaymentMessage.fromObject = (obj) => new PaymentMessage(obj.type, obj.ref, obj.psbt);

module.exports = { PaymentMessage, PaymentMessageType };
