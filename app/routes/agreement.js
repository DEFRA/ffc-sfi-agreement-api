const joi = require('joi')
const { getAgreements, getAgreementbySbi, getAgreement, addAgreement, updateAgreement, checkAgreementExists } = require('../agreement')
const { addProgress, updateProgress } = require('../agreement-progress')

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
      const agreements = await getAgreementbySbi(request.params.sbi)
      return agreements.length ? h.response(agreements).code(200) : h.response('No data available').code(404)
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
      return agreement ? h.response(agreement).code(200) : h.response([]).code(404)
    }
  }
},
{
  method: 'POST',
  path: '/agreement',
  options: {
    validate: {
      payload: joi.object({
        saveAgreement: joi.object().required(),
        progress: joi.object().required()
      }),
      failAction: async (request, h, error) => {
        return h.response('Bad request').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const progressId = await addProgress(request.payload.progress.progress)
      const agreementNumber = await addAgreement(request.payload.saveAgreement, progressId)
      return h.response(`{ "progressId": ${progressId}, "agreementNumber": "${agreementNumber}" }`)
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
        saveAgreement: joi.object().required(),
        progress: joi.object().required()
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
        await updateAgreement(request.payload.saveAgreement)
        await updateProgress(request.payload.progress)
        return h.response('ok').code(204)
      }

      return h.response('Not found').code(404)
    }
  }
}]
