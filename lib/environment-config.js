const pick = require('lodash.pick')

module.exports = (config) => {
  // replace existing values in the config with those set using environmental variables
  let configKeys = Object.keys(config)

  // grab the list of keys that exist in both sources
  let intersection = Object.keys(process.env).filter(key => configKeys.includes(key))
  let configFromEnv = pick(process.env, intersection)
  return Object.assign(config, configFromEnv)
}
