const _ = require('lodash')
const ycb = require('ycb')
const util = require('util')

const features = require('./config/features.json')
const initialConfig = require('config')

const contextualizer = require('./middleware/contextualizer')
const ycbUtils = require('./lib/ycb-utils')

// create the initial ycb configuration array
const ycbConfigArray = ycbUtils(initialConfig)
const ycbObj = new ycb.Ycb(ycbConfigArray)

// initial dimensions
const staticContext = Object.freeze({
    environment: process.env.NODE_ENV  || 'development',
    colocation: process.env.COLOCATION || 'west'
})

let staticConfig = Object.freeze(_.assign(features, ycbObj.read(staticContext)))

const express = require('express')
const app = express()

app.use(contextualizer({ staticContext, staticConfig, ycbConfigArray}))

app.get('/', function (req, res) {
    res.json(staticContext)
})

app.get('/static_context', function (req, res) {
    res.json(staticContext)
})

app.get('/dynamic_context', function (req, res) {
    res.json(req.context)
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
