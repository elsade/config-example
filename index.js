const util = require('util')

const ycbConfig = require('./lib/ycb-config')()

const contextualizer = require('./middleware/contextualizer')

let staticConfig = ycbConfig.getConfig()

const express = require('express')
const app = express()

app.use(contextualizer({ ycbConfig }))

app.get('/', function (req, res) {
  res.json(ycbConfig.getContext())
})

app.get('/static_context', function (req, res) {
  res.json(ycbConfig.getContext())
})

app.get('/dynamic_context', function (req, res) {
  res.json(req.__context)
})

app.get('/static_config', function (req, res) {
  res.json(staticConfig)
})

app.get('/dynamic_config', function (req, res) {
  console.log(`log_level: ${req.config.logLevel}, /dynamic_config ${util.inspect(req.config)}`)
  res.json(req.config)
})

app.listen(staticConfig.appPort, function () {
  console.log(`Config prototype app listening on port ${staticConfig.appPort}`)
})
