let _ = require('lodash')

let dimensions = require('../config/dimensions.json')
let fixtures = require('../config/ycb-fixtures.json')

const createFixture = (name, value, config) => {
    return _.assign({settings: [`${name}:${value}`]}, config)
}

module.exports = function(config) {

    return [
        {
            dimensions: dimensions
        },
        createFixture('environment', 'development', config),
        createFixture('environment', 'staging,production', config),
        ...fixtures
    ]
}