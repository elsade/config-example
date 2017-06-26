/* global describe, it, expect, beforeEach */

let ycb = require('ycb')
let dimensions = require('./config/ycb-config/dimensions.json')

let configArray = [
  {
    dimensions: dimensions
  },
  {
    settings: ['master']
  },
  {
    settings: ['environment:development'],
    appPort: 3000,
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    logLevel: 'debug'
  },
  {
    settings: ['environment:staging,production'],
    appPort: 8080,
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    logLevel: 'error'
  },
  {
    settings: ['colocation:east,west'],
    timeout: 1000
  },
  {
    settings: ['colocation:eu'],
    timeout: 3000
  },
  {
    settings: ['colocation:ap'],
    timeout: 500
  }
]

let ycbObj = new ycb.Ycb(configArray)

describe('YCB Tests', () => {
  beforeEach(() => {
  })

  it('env=development', () => {
    let context = { environment: 'development' }
    let computedConfig = ycbObj.read(context)
    expect(computedConfig.client).toEqual('sqlite3')

    let { connection } = computedConfig
    expect(connection.filename).toEqual('./dev.sqlite3')

    expect(computedConfig.logLevel).toEqual('debug')
  })

  it('env=production', () => {
    let context = { environment: 'production' }
    let computedConfig = ycbObj.read(context)
    expect(computedConfig.client).toEqual('postgresql')

    let { connection } = computedConfig
    expect(connection.database).toEqual('my_db')
    expect(connection.user).toEqual('username')
    expect(connection.password).toEqual('password')

    expect(computedConfig.logLevel).toEqual('error')
  })

  it('colocation=Asia Pacific', () => {
    let context = { colocation: 'ap' }
    let computedConfig = ycbObj.read(context)

    expect(computedConfig.timeout).toEqual(500)
  })

  it('env=production, colocation=Asia Pacific', () => {
    let context = { environment: 'production', colocation: 'ap' }
    let computedConfig = ycbObj.read(context)

    expect(computedConfig.client).toEqual('postgresql')

    let { connection } = computedConfig

    expect(connection.database).toEqual('my_db')
    expect(connection.user).toEqual('username')
    expect(connection.password).toEqual('password')

    expect(computedConfig.logLevel).toEqual('error')
    expect(computedConfig.timeout).toEqual(500)
  })
})
