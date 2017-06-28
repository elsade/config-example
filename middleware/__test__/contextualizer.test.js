/* global describe, it, expect, beforeEach, spyOn */
const ycbConfig = require('../../lib/ycb-config')
const contextualizer = require('../contextualizer')

beforeEach(() => {
})

describe('contextualizer test suite', () => {
  it('The modules loads', () => {
    expect(ycbConfig).toBeDefined()
    expect(contextualizer).toBeDefined()
  })
  it('contextualizer env=production,colo=west ', () => {
    let context = {
      environment: 'production',
      colocation: 'us-west-1'
    };
    const ycbConfigInstance = ycbConfig({context})

    const staticContext = ycbConfigInstance.getContext()
    expect(staticContext).toEqual(context)

    const contextualizerMiddleware = contextualizer({ycbConfig: ycbConfigInstance})
    expect(contextualizer).toBeDefined()
    let req = {
      headers: {}
    }
    contextualizerMiddleware(req, {}, () => {})
    expect(req.config).toEqual({ lang: 'en-US',
      internal: false,
      logLevel: 'error',
      feature_enforce_cap_limit: true,
      appPort: 8080,
      client: 'postgresql',
      connection_database: 'my_db',
      connection_user: 'username',
      connection_password: 'password',
      pool_min: 2,
      pool_max: 10,
      migrations_tableName: 'knex_migrations',
      cap_limit: 0,
      timeout: 1000 }
    )
  })
  it('contextualizer env=development,colo=ap-northeast-2 ', () => {
    let context = {
      environment: 'development',
      colocation: 'ap-northeast-2'
    };
    const ycbConfigInstance = ycbConfig({context})

    const staticContext = ycbConfigInstance.getContext()
    expect(staticContext).toEqual(context)

    const contextualizerMiddleware = contextualizer({ycbConfig: ycbConfigInstance})
    expect(contextualizer).toBeDefined()
    let req = {
      headers: {}
    }
    contextualizerMiddleware(req, {}, () => {})
    expect(req.config).toEqual({ lang: 'en-US',
      internal: false,
      logLevel: 'debug',
      feature_enforce_cap_limit: true,
      appPort: 3000,
      client: 'sqlite3',
      connection_filename: './dev.sqlite3',
      cap_limit: 0,
      timeout: 500 }
    )
  })
  it('contextualizer req contains headers ', () => {
    let context = {}
    const ycbConfigInstance = ycbConfig({context})

    const staticContext = ycbConfigInstance.getContext()
    expect(staticContext).toEqual(context)

    const contextualizerMiddleware = contextualizer({ycbConfig: ycbConfigInstance})
    expect(contextualizer).toBeDefined()
    let req = {
      headers: {
        // this should set internal to true
        username: 'jdoe@sixfivelabs.com',
        // this should set the logLevel to 'error'
        'log-level': 'error'
      }
    }
    contextualizerMiddleware(req, {}, () => undefined)
    expect(req.config).toEqual({ lang: 'en-US',
      internal: true,
      logLevel: 'error',
      feature_enforce_cap_limit: false,
      cap_limit: 0
    })
  })
})
