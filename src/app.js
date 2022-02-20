const express = require('express')

require('dotenv').config()

const api = require('./api')
const admin = require('./admin')

const app = express()

app.use('/api/v1', api)
app.use('/admin', admin)

module.exports = app
