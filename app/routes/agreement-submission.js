const joi = require('joi')
const { sendAgreementSubmitMessage } = require('../messaging')
const { getAgreement } = require('../agreement')

module.exports = [{
  method: 'POST',
  path: '/agreement/submission',
  options: {
    validate: {
      payload: joi.object({
        agreementNumber: joi.string().required(),
        sbi: joi.number().min(10 ** 8).max(10 ** 9 - 1).required()
      }),
      failAction: async (request, h, error) => {
        return h.response('Bad request').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const agreement = await getAgreement(request.payload.agreementNumber, request.payload.sbi)
      if (agreement) {
        await sendAgreementSubmitMessage(agreement.agreementData)
        return h.response(`Agreement Submitted: ${agreement.agreementNumber}`)
          .code(201)
      }

      return h.response('Not found').code(404)
    }
  }
}]
