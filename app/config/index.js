const joi = require('joi')
const dbConfig = require('./db-config')
const mqConfig = require('./mq-config')

// Define config schema
const schema = joi.object({
  port: joi.number().default(3009),
  env: joi.string().valid('development', 'test', 'production').default('development')
})

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
const value = result.value

value.submitTopic = mqConfig.submitTopic

value.isDev = value.env === 'development'
value.isTest = value.env === 'test'
value.isProd = value.env === 'production'

value.dbConfig = dbConfig

module.exports = value
