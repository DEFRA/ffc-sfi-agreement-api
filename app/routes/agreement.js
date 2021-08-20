const joi = require('joi')
const { getAgreements, getAgreement, saveAgreement } = require('../agreement')

module.exports = [{
  method: 'GET',
  path: '/agreements',
  options: {
    handler: async (request, h) => {
      const agreements = await getAgreements()
      return h.response(agreements).code(200)
    }
  }
},
{
  method: 'GET',
  path: '/agreement/{agreementId}',
  options: {
    validate: {
      params: joi.object({
        agreementId: joi.string().required()
      }),
      failAction: async (request, h, error) => {
        return h.response('Not found').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const agreement = await getAgreement(request.params.agreementId)
      return h.response(agreement).code(200)
    }
  }
},
{
  method: 'POST',
  path: '/agreement',
  options: {
    validate: {
      payload: joi.object({
        agreement: joi.object().keys({
          sbi: joi.number().required()
        })
      }),
      failAction: async (request, h, error) => {
        return h.response('Not found').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await saveAgreement(request.payload.agreement, 1)
      return h.response('ok').code(204)
    }
  }
}]
