const joi = require('joi')
const { getProgress, addProgress, updateProgress } = require('../agreement-progress')

module.exports = [{
  method: 'GET',
  path: '/agreement/progress/{progressId}',
  options: {
    validate: {
      params: joi.object().keys({
        progressId: joi.number().required()
      }),
      failAction: async (request, h, error) => {
        return h.response('Bad request').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const agreement = await getProgress(request.params.progressId)
      return agreement ? h.response(agreement).code(200) : h.response('Not data available').code(404)
    }
  }
},
{
  method: 'POST',
  path: '/agreement/progress',
  options: {
    validate: {
      payload: joi.object({
        eligibility: joi.boolean().required(),
        businessDetails: joi.boolean().required()
      }),
      failAction: async (request, h, error) => {
        return h.response('Bad request').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const progress = await addProgress(request.payload)
      return h.response('ok')
        .code(201)
        .header('Location', `/agreement/progress/${progress}`)
    }
  }
},
{
  method: 'PUT',
  path: '/agreement/progress/{progressId}',
  options: {
    validate: {
      params: joi.object().keys({
        progressId: joi.number().required()
      }),
      payload: joi.object({
        eligibility: joi.boolean().required(),
        businessDetails: joi.boolean().required()
      }),
      failAction: async (request, h, error) => {
        return h.response('Bad request').code(400).takeover()
      }
    },
    handler: async (request, h) => {
      await updateProgress(request.payload, request.params.progressId)
      return h.response('ok').code(204)
    }
  }
}]
