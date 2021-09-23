const joi = require('joi')

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    useCredentialChain: joi.bool().default(false),
    type: joi.string(),
    username: joi.string(),
    password: joi.string(),
    appInsights: joi.object()
  },
  submitTopic: {
    address: joi.string().default('submit')
  }
})
const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === 'production',
    type: 'Topic',
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  submitTopic: {
    address: process.env.SUBMIT_TOPIC_ADDRESS
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const submitTopic = { ...mqResult.value.messageQueue, ...mqResult.value.submitTopic }

module.exports = {
  submitTopic
}
