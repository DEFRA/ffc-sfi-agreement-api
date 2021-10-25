const generateAgreementNumber = require('../../../../../app/agreement-number')
const db = require('../../../../../app/data')

describe('agreement route', () => {
  let createServer
  let server
  let progressData
  let sbi
  let enrichedAgreement
  let agreementData
  let agreementNumber

  beforeAll(async () => {
    sbi = 123456789
    agreementNumber = generateAgreementNumber()

    agreementData = {
      agreementNumber,
      sbi,
      paymentAmount: 100
    }

    progressData = {
      progressId: 0,
      progress: {
        eligibility: true,
        businessDetails: true
      }
    }

    enrichedAgreement = {
      saveAgreement: agreementData,
      progress: progressData
    }

    await db.agreement.destroy({ truncate: { cascade: true } })
  })

  beforeEach(async () => {
    createServer = require('../../../../../app/server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  afterAll(async () => {
    await db.agreement.destroy({ truncate: { cascade: true } })
    await db.sequelize.close()
  })

  test('POST /agreement returns 201', async () => {
    const options = {
      method: 'POST',
      url: '/agreement',
      payload: enrichedAgreement
    }

    const result = await server.inject(options)
    const response = JSON.parse(result.payload)
    agreementNumber = response.agreementNumber
    enrichedAgreement.progress.progressId = response.progressId
    expect(result.statusCode).toBe(201)
  })

  test('POST /agreement returns 400', async () => {
    const options = {
      method: 'POST',
      url: '/agreement',
      payload: {}
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test('GET /agreements returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/agreements'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('GET /agreements by sbi 123456789 returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/agreements/123456789'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('GET /agreements by sbi 987654321 returns 400', async () => {
    const options = {
      method: 'GET',
      url: '/agreements/987654321'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(404)
  })

  test('GET /agreement returns 400', async () => {
    const options = {
      method: 'GET',
      url: '/agreement/123456789/abcdefghi'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test('GET /agreement returns 404', async () => {
    const options = {
      method: 'GET',
      url: '/agreement/123456789/123456789'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(404)
  })

  test('GET /agreement returns 200', async () => {
    const options = {
      method: 'GET',
      url: `/agreement/${agreementNumber}/${sbi}`
    }
    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('PUT /agreement returns 204', async () => {
    const options = {
      method: 'PUT',
      url: `/agreement/${agreementNumber}/${sbi}`,
      payload: enrichedAgreement
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(204)
  })

  test('PUT /agreement returns 400', async () => {
    const options = {
      method: 'PUT',
      url: `/agreement/${agreementNumber}/${sbi}`,
      payload: {}
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test('PUT /agreement returns 404', async () => {
    const options = {
      method: 'PUT',
      url: `/agreement/${agreementNumber}/987654321`,
      payload: enrichedAgreement
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(404)
  })
})
