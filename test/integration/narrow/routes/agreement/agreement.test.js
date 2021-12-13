const db = require('../../../../../app/data')

describe('agreement route', () => {
  let createServer
  let server
  let sbi
  let enrichedAgreement
  let agreementData
  let agreementNumber

  beforeAll(async () => {
    sbi = 123456789
    agreementNumber = 'AG123456789'

    agreementData = {
      agreementNumber,
      organisation: {
        sbi
      },
      action: {
        paymentAmount: 100
      }
    }

    enrichedAgreement = agreementData

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
    expect(result.statusCode).toBe(201)
  })

  test('POST /agreement returns 400', async () => {
    const options = {
      method: 'POST',
      url: '/agreement'
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

  test('GET /agreement returns 400', async () => {
    const options = {
      method: 'GET',
      url: '/agreement/abcdefghi/123456789'
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
      url: `/agreement/${sbi}/${agreementNumber}`
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
      url: `/agreement/${agreementNumber}/${sbi}`
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })
})
