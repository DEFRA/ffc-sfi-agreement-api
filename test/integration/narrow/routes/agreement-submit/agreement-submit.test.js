const db = require('../../../../../app/data')

describe('agreement submit route', () => {
  let createServer
  let server
  let agreementData
  let progressData

  beforeAll(async () => {
    agreementData = {
      callerId: '5037879',
      agreementNumber: '123456789',
      sbi: 123456789,
      agreement: {
        selectedAmbitionLevel: {
          name: 'Introductory',
          level: {
            rate: '26.00',
            paymentAmount: '4383801.50'
          }
        },
        selectedOrganisation: {
          sbi: 106219996,
          name: 'Mr S Baker',
          organisationId: 5573787
        },
        selectedStandard: {
          code: '110',
          landCoverCodes: [
            '110'
          ],
          name: 'Arable and horticultural soils',
          parcels: [
            {
              id: 'TQ22526635',
              area: 13.387652,
              warnings: []
            },
            {
              id: 'TQ21529203',
              area: 3.473123,
              warnings: []
            }
          ]
        },
        selectedParcels: [
          {
            id: 'TQ22526635',
            value: 13.39,
            area: 13.387652,
            valid: true
          },
          {
            id: 'TQ21529203',
            value: 3.47,
            area: 3.473123,
            valid: true
          }
        ]
      }
    }

    progressData = {
      progressId: 0,
      progress: {
        eligibility: true,
        businessDetails: true
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
    const addedProgress = await db.progress.create({ progress: progressData })
    await db.agreement.create({ agreementNumber: agreementData.agreementNumber, sbi: agreementData.sbi, agreementData, progressId: addedProgress.progressId })
    const options = {
      method: 'POST',
      url: '/agreement/submit',
      payload: { agreementNumber: agreementData.agreementNumber, sbi: agreementData.sbi }
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
