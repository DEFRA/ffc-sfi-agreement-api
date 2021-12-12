const joi = require('joi')
const { getAgreements, getAgreementBySbi, getAgreement, addAgreement, updateAgreement, checkAgreementExists } = require('../agreement')

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
  path: '/agreements/{sbi}',
  options: {
    validate: {
      params: joi.object().keys({
        sbi: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        return h.response('Bad request').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const sbi = request.params.sbi
      const agreements = await getAgreementBySbi(sbi)
      return h.response({ sbi, agreements }).code(200)
    }
  }
},
{
  method: 'GET',
  path: '/agreement/{sbi}/{agreementNumber}',
  options: {
    validate: {
      params: joi.object().keys({
        sbi: joi.number().required(),
        agreementNumber: joi.string().required()
      }),
      failAction: async (request, h, error) => {
        return h.response('Bad request').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const agreement = await getAgreement(request.params.agreementNumber, request.params.sbi)
      return agreement ? h.response(agreement).code(200) : h.response(agreement).code(404)
    }
  }
},
{
  method: 'POST',
  path: '/agreement',
  options: {
    validate: {
      payload: joi.object(),
      failAction: async (request, h, error) => {
        return h.response('Bad request').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await addAgreement(request.payload.agreement)
      return h.response('ok')
        .code(201)
        .header('Location', `/agreement/${request.payload.agreement.agreementNumber}/${request.payload.sbi}`)
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
      payload: joi.object(),
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
        await updateAgreement(request.payload.agreement)
        return h.response('ok').code(204)
      }

      return h.response('Not found').code(404)
    }
  }
}]
