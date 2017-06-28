const applyEnvironmentVariableOverrides = require('../lib/environment-config')

const setBucketInternalContext = (req, dynamicContext) => {
  // enabled internal override for '@sixfivelabs.com' users
  const {username} = req.headers
  if (username) {
    const match = username.match(/.*@sixfivelabs.com/)
    if (match) {
      dynamicContext.bucket.push('internal')
    }
  }
  return dynamicContext
}

const setLogLevelContext = (req, dynamicContext) => {
  dynamicContext.logLevel = req.headers['log-level']
  return dynamicContext
}

const reduceContext = (req) => {
  const subcontextualizers = [
    setBucketInternalContext,
    setLogLevelContext
  ]
  // apply each of the functions that mutate the context and reduce to a single context
  return subcontextualizers.reduce((prev, func) => {
    return func(req, prev)
  }, { bucket: [] })
}

module.exports = function createContextualizer (options) {
  return function contextualizer (req, res, next) {
    const { ycbConfig } = options
    const dynamicYcbObject = ycbConfig.getYcbObject()
    const staticContext = ycbConfig.getContext()
    let dynamicContext = reduceContext(req)

    // append the full context to the request
    dynamicContext = Object.freeze(Object.assign({}, staticContext, dynamicContext))

    // TODO::AG-this should be removed once initial testing is done
    req.__context = dynamicContext

    let dynamicConfig = dynamicYcbObject.read(dynamicContext)

    // replace configuration params with env variables here
    dynamicConfig = applyEnvironmentVariableOverrides(dynamicConfig)

    // append the full config to the request
    req.config = Object.freeze(dynamicConfig)

    next()
  }
}
