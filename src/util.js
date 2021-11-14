const axios = require('axios');

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