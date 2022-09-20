const assert = require('assert')
const test = require('ava')
const { bip32 } = require('bitcoinjs-lib')
const networks = require('../src/networks')
const { getAddress } = require('./helpers')


test('should be valid', t => {
  const xpriv = "dgpv51eADS3spNJh8h13wso3DdDAw3EJRqWvftZyjTNCFEG7gqV6zsZmucmJR6xZfvgfmzUthVC6LNicBeNNDQdLiqjQJjPeZnxG8uW3Q3gCA3e"
  const root = bip32.fromBase58(xpriv, networks.mainnet);
  
  let child1 = root.derivePath("m/44'/3'/0'/0/0");
  
  console.log(getAddress(child1, networks.mainnet))
  
  root.network = networks.mainnet;
  
  const str = root.derivePath("m/44'/3'/0'/0/0").neutered().toBase58();
  
  assert.strictEqual(
    getAddress(child1, networks.mainnet),
    'DCm7oSg95sxwn3sWxYUDHgKKbB2mDmuR3B',
  );
  assert.strictEqual(
    child1.neutered().toBase58(),
    'dgub8vXjuDpn2sTkerBdjSfq9kmjhaQsXHxyBkYrikw84GCYz9ozcdwvYPo5SSDWqZUVT5d4jrG8CHiGsC1M7pdETPhoKiQa92znT2vG9YaytBH',
  );

  child1 = root.derivePath("m/44'/3'/0'/1/0");
  assert.strictEqual(
    getAddress(child1, networks.mainnet),
    'D91jVi3CVGhRmyt83fhMdL4UJWtDuiTZET',
  );
  assert.strictEqual(
    child1.neutered().toBase58(),
    'dgub8uxGyZKCxRo2buadqKBPGR5MMDrbk8RABK8EcnBv5GrdS8u1Lw2ifRSifsT3wuVRsK45b9kugWkd2cREzkJLiGvwbY5txG2dKfsY3bndC93',
  );
  
  child1 = root.derivePath("m/44'/3'/1'/0/0");
  assert.strictEqual(
    getAddress(child1, networks.mainnet),
    'D9cFn3k3e1yNprkbeTLNDEFwA39KK4Kn2q',
  );
  assert.strictEqual(
    child1.neutered().toBase58(),
    'dgub8wdiEmcUJMWMvv3yaMw4BZpSFycJbYKsSojvgB7YtHWoiRePJfLV1eFkbM2up2rkvEeukK9ffXypdLscJKJH8MwTe8hvJcWhcMdwwjpLKmQ',
  );
  
  child1 = root.derivePath("m/44'/3'/1'/1/0");
  assert.strictEqual(
    getAddress(child1, networks.mainnet),
    'DCxt3eygtihpguzKyar92e6QLHfQvqRa1C',
  );
  assert.strictEqual(
    child1.neutered().toBase58(),
    'dgub8wfrZMXz8ojFYd4AcuUWf8b2tuTaH8hEmy67f6uA2WEBdaAWNti2dRXsADFSsM26nsiaPR81pZNE3Y2ws89HK46qtGifYJTb7RGzbhr8CiC',
  );
  
  child1 = root.derivePath("m/44'/3'/1'/0/1");
  assert.strictEqual(
    getAddress(child1, networks.mainnet),
    'D5Se361tds246n9Bm6diMQwkg7PfQrME65',
  );
  assert.strictEqual(
    child1.neutered().toBase58(),
    'dgub8wdiEmcUJMWMxz36J7L7hP5Ge1uZpvHgEJvBkWgQa2wRYbLVyuWq3WWaiK3ZgYs893RqrgZN3QgRghPXkpRr7kdT44XVSaJuwMF1PTHi2mQ',
  );
  
  child1 = root.derivePath("m/44'/3'/1'/1/1");
  assert.strictEqual(
    getAddress(child1, networks.mainnet),
    'DD5ztaSL3pscXYL6XXcRFTvbdghKppsKDn',
  );
  assert.strictEqual(
    child1.neutered().toBase58(),
    'dgub8wfrZMXz8ojFcPziSubEoQ65sB4PYPyYTMo3PqFwf2Vx5zZ6ia17Nk2Py25c3dvq1e7ZnfBrurCS5wuagzRoBCXhJ2NeGU54NBytvuUuRyA',
  );

  t.pass()
})
