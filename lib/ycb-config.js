const fs = require('fs')
const path = require('path')
const ycb = require('ycb')
const yaml = require('js-yaml')

const applyEnvironmentVariableOverrides = require('../lib/environment-config')

module.exports = function (options = {}) {
  const loadYamlSync = (path) => {
    let config = {}
    try {
      config = yaml.safeLoad(fs.readFileSync(path, 'utf8'))
    } catch (e) {
      console.log(e)
    }
    return config
  }

  const determineContext = () => {
    return Object.freeze({
      environment: process.env.NODE_ENV || 'development',
      colocation: process.env.COLOCATION || 'us-west-1'
    })
  }

  const configPath = path.join(__dirname, '/../config/config.yaml')
  const dimensionsPath = path.join(__dirname, '/../config/dimensions.yaml')
  const initialConfig = loadYamlSync(configPath)
  const dimensions = loadYamlSync(dimensionsPath)
  const staticContext = options.context || determineContext()

  // combine the dimensions and the configuration into the format ycb expects
  const ycbArray = [
    { dimensions },
    ...initialConfig
  ]

  // we'll need the ycbObject for later calls to read() in the contextualizer
  const ycbObject = new ycb.Ycb(ycbArray)

  let config = ycbObject.read(staticContext)

  config = applyEnvironmentVariableOverrides(config)

  const staticConfig = Object.freeze(config)

  return {
    getContext: () => staticContext,
    getConfig: () => staticConfig,
    getYcbObject: () => ycbObject
  }
}
