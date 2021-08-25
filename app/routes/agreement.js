const joi = require('joi')
const { getAgreements, getAgreement, addAgreement, updateAgreement, checkAgreementExists } = require('../agreement')

module.exports = [{
  method: 'GET',
  path: '/agreements',
  options: {
    handler: async (request, h) => {
      const agreements = await getAgreements()
      return agreements.length ? h.response(agreements).code(200) : h.response('Not data available').code(404)
    }
  }
},
{
  method: 'GET',
  path: '/agreement/{agreementNumber}/{sbi}',
  options: {
    validate: {
      params: joi.object().keys({
        agreementNumber: joi.string().required(),
        sbi: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        return h.response('Bad request').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const agreement = await getAgreement(request.params.agreementNumber, request.params.sbi)
      return agreement ? h.response(agreement).code(200) : h.response('Not data available').code(404)
    }
  }
},
{
  method: 'POST',
  path: '/agreement',
  options: {
    validate: {
      payload: joi.object({
        agreementNumber: joi.string().required(),
        sbi: joi.number().required(),
        paymentAmount: joi.number()
      }),
      failAction: async (request, h, error) => {
        return h.response('Bad request').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const agreementNumber = await addAgreement(request.payload, 1)
      return h.response('ok')
        .code(201)
        .header('Location', `/agreement/${agreementNumber}/${request.payload.sbi}`)
    }
  }
},
{
  method: 'PUT',
  path: '/agreement/{agreementNumber}/{sbi}',
  options: {
    validate: {
      params: joi.object().keys({
        agreementNumber: joi.string().required(),
        sbi: joi.number().required()
      }),
      payload: joi.object({
        agreementNumber: joi.string().required(),
        sbi: joi.number().required(),
        paymentAmount: joi.number()
      }),
      failAction: async (request, h, error) => {
        return h.response('Bad request').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const agreement = await checkAgreementExists(
        {
          agreementNumber: request.params.agreementNumber,
          sbi: request.params.sbi
        })

      if (agreement) {
        await updateAgreement(request.payload)
        return h.response('ok').code(204)
      }

      return h.response('Not found').code(404)
    }
  }
}]
