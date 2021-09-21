const joi = require('joi')
const { v4: uuidv4 } = require('uuid')
const { sendAgreementSubmitMessage } = require('../messaging')

module.exports = [{
  method: 'POST',
  path: '/agreement/submission',
  options: {
    validate: {
      payload: joi.object({
        agreementNumber: joi.string().required(),
        sbi: joi.string().required(),
        agreement: joi.object().required()
      }),
      failAction: async (request, h, error) => {
        return h.response('Bad request').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const messageId = uuidv4()
      await sendAgreementSubmitMessage(request.payload, messageId)

      return h.response('ok')
        .code(201)
    }
  }
}]
