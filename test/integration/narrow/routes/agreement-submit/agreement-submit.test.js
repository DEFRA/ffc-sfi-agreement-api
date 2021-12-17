const db = require('../../../../../app/data')

describe('agreement submit route', () => {
  let createServer
  let server
  let agreementData

  beforeAll(async () => {
    agreementData = {
      callerId: '5037879',
      agreementNumber: '123456789',
      organisation: {
        sbi: 123456789
      },
      action: {
        'sfi-improved-grassland': {
          paymentAmount: 100
        }
      }
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

  test('POST /agreement/submit returns 201', async () => {
    await db.agreement.create({ agreementNumber: agreementData.agreementNumber, sbi: agreementData.organisation.sbi, agreementData })
    const options = {
      method: 'POST',
      url: '/agreement/submit',
      payload: { agreementNumber: agreementData.agreementNumber, sbi: agreementData.organisation.sbi }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(201)
  })

  test('POST /agreement/submit returns 404', async () => {
    const options = {
      method: 'POST',
      url: '/agreement/submit',
      payload: { agreementNumber: agreementData.agreementNumber, sbi: 987654321 }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(404)
  })

  test('POST /agreement/submit returns 400 when agreementNumber is missing', async () => {
    const options = {
      method: 'POST',
      url: '/agreement/submit',
      payload: { sbi: 123 }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test('POST /agreement/submit returns 400 when an incorrect sbi number length is supplied', async () => {
    const options = {
      method: 'POST',
      url: '/agreement/submit',
      payload: { agreementNumber: agreementData.agreementNumber, sbi: 123 }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })
})
