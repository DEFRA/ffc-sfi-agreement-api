const joi = require('joi')
const { sendAgreementSubmitMessage } = require('../messaging')
const { getAgreementByNumberAndSbi } = require('../agreement')

module.exports = [{
  method: 'POST',
  path: '/agreement/submit',
  options: {
    validate: {
      payload: joi.object({
        agreementNumber: joi.string().required(),
        sbi: joi.number().min(105000000).max(999999999).required()
      }),
      failAction: async (request, h, error) => {
        return h.response('Bad request').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const agreement = await getAgreementByNumberAndSbi(request.payload.agreementNumber, request.payload.sbi)
      if (agreement?.agreementData) {
        for (const funding in agreement.agreementData.action) {
          if (!agreement.agreementData.action[funding].active && funding !== 'paymentAmount') {
            delete agreement.agreementData.action[funding]
          }
        }
        await sendAgreementSubmitMessage(agreement.agreementData)
        return h.response(`Agreement Submitted: ${agreement.agreementNumber}`)
          .code(201)
      }

      return h.response('Not found').code(404)
    }
  }
}]
