/* global describe, it, expect, beforeEach, spyOn */

// import module under test here
const ycbConfig = require('../ycb-config')

beforeEach(() => {
})

describe('Configuration Test Suite', () => {
  it('The module loads', () => {
    expect(ycbConfig).toBeDefined()
  })

  describe('static configuration', () => {
    beforeEach(() => {
    })

    it('default configuration works', () => {
      const ycb = ycbConfig({ context: {
        colocation: 'us-west-1'
      }})

      const staticContext = ycb.getContext()

      expect(staticContext).toEqual({
        colocation: 'us-west-1'
      })

      const staticConfig = ycb.getConfig()
      expect(staticConfig).toEqual({
        lang: 'en-US',
        internal: false,
        logLevel: 'debug',
        feature_enforce_cap_limit: true,
        cap_limit: 0,
        timeout: 1000
      })

      const ycbObject = ycb.getYcbObject()
      expect(ycbObject).toBeDefined()
    })

    it('development configuration works', () => {
      const ycb = ycbConfig({ context: {
        environment: 'development',
        colocation: 'us-west-1'
      }})

      const staticContext = ycb.getContext()

      expect(staticContext).toEqual({
        environment: 'development',
        colocation: 'us-west-1'
      })

      const staticConfig = ycb.getConfig()
      expect(staticConfig).toEqual({ lang: 'en-US',
        internal: false,
        logLevel: 'debug',
        feature_enforce_cap_limit: true,
        appPort: 3000,
        client: 'sqlite3',
        connection_filename: './dev.sqlite3',
        cap_limit: 0,
        timeout: 1000
      })

      const ycbObject = ycb.getYcbObject()
      expect(ycbObject).toBeDefined()
    })

    it('production configuration works', () => {
      const ycb = ycbConfig({ context: {
        environment: 'production',
        colocation: 'ap-northeast-2'
      }})

      const staticContext = ycb.getContext()

      expect(staticContext).toEqual({
        environment: 'production',
        colocation: 'ap-northeast-2'
      })

      const staticConfig = ycb.getConfig()
      expect(staticConfig).toEqual({ lang: 'en-US',
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
        timeout: 500
      })

      const ycbObject = ycb.getYcbObject()
      expect(ycbObject).toBeDefined()
    })
  })
})
