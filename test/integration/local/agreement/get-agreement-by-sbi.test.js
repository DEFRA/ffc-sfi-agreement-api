const db = require('../../../../app/data')
const { getAgreementbySbi } = require('../../../../app/agreement')
const generateAgreementNumber = require('../../../../app/agreement-number')

let agreementData
let progressData
let agreementNumber

describe('get Agreement by sbi', () => {
  beforeEach(async () => {
    agreementNumber = generateAgreementNumber()
    agreementData = {
      agreementNumber,
      sbi: 123456789,
      paymentAmount: 100,
      standards: [{
        id: '110',
        ambitionLevel: 'Introductory',
        parcels: [{
          id: 'SW72366798',
          area: 1.4548
        }]
      }]
    }

    progressData = {
      eligibility: true,
      businessDetails: true
    }

    await db.agreement.destroy({ truncate: { cascade: true } })
  })

  afterAll(async () => {
    await db.agreement.destroy({ truncate: { cascade: true } })
    await db.sequelize.close()
  })

  test('should return 1 agreement', async () => {
    const progress = await db.progress.create({ progress: progressData })
    await db.agreement.create({ agreementNumber, sbi: agreementData.sbi, agreementData, progressId: progress.progressId })
    const agreements = await getAgreementbySbi(agreementData.sbi)
    expect(agreements).toMatchObject(
      [{
        agreementNumber,
        sbi: agreementData.sbi,
        agreementData,
        progressId: progress.progressId
      }]
    )
  })

  test('should return no agreement', async () => {
    const agreements = await getAgreementbySbi(agreementData.sbi)
    expect(agreements).toEqual([])
  })
})
