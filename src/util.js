const { postData } = require('./middlewares')

// Dogecoin JSON RPC token
const token = Buffer.from('hello:world', 'utf8').toString('base64')

function jsonRPC (command, params) {
    return postData('http://127.0.0.1:18332', {
		jsonrpc: '1.0',
		id: 'wow',
		method: command, 
		params: params
	}, {
    headers: {
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    },
  })
}

module.exports = {
    jsonRPC
}