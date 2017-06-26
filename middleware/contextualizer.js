let _ = require('lodash')
let ycb = require('ycb');

const setBucketInternal = (req, dynamicContext) => {
    // enabled internal override for '@sixfivelabs.com' users
    const {username} = req.headers
    if (username) {
        const match = username.match(/.*@sixfivelabs.com/)
        if (match) {
            dynamicContext.bucket.push('internal')
        }
    }
}

module.exports = function createContextualizer( options ) {
    return function contextualizer(req, res, next) {

        const { staticContext, staticConfig, ycbConfigArray } = options
        const dynamicYcbObject = new ycb.Ycb(ycbConfigArray)
        let dynamicContext = {
            bucket: []
        }

        setBucketInternal(req, dynamicContext)

        // append the full context to the request
        req.context = Object.freeze(_.assign({}, staticContext, dynamicContext))

        const dynamicConfig = dynamicYcbObject.read(req.context)

        // append the full config to the request
        req.config = Object.freeze(_.assign({}, staticConfig, dynamicConfig))

        next()
    }
}