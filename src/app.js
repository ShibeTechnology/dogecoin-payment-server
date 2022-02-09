const express = require('express')
const helmet = require('helmet')

require('dotenv').config()

const middlewares = require('./middlewares')
const api = require('./api')

const app = express()

app.use(helmet())
app.use(express.json())

app.use('/api/v1', api)

app.use(middlewares.errorHandler)

module.exports = app
