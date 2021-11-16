const axios = require('axios');

let config = [process.env.RPC_USER, process.env.RPC_PASSWORD, process.env.RPC_URL, process.env.RPC_PORT]
function checkConfig(x) {
  x.map(k => {
    if (!k) {
      throw new Error(`Missing RPC environment variable`)
    }
  })
}

try {
  checkConfig(config)
} catch(e) {
  console.log(e.message)
  process.exit(0)
}

// Dogecoin JSON RPC token
const token = Buffer.from(`${process.env.RPC_USER}:${process.env.RPC_PASSWORD}`, 'utf8').toString('base64')

function jsonRPC (command, params) {
    return axios.post(`http://${process.env.RPC_URL}:${process.env.RPC_PORT}`, {
		jsonrpc: '2.0',
		id: 'wow',
		method: command, 
		params: params
	}, {
    headers: {
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    },
  })
  .then(function (result) {
    return result.data
  })
}

module.exports = {
    jsonRPC
}