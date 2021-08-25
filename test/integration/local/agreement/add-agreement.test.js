const db = require('../../../../app/data')
const { addAgreement, checkAgreementExists } = require('../../../../app/agreement')
const generateAgreementNumber = require('../../../../app/agreement-number')

let agreementData
let progressData
let agreementNumber

describe('add Agreement', () => {
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

  test('should add 1 agreement', async () => {
    const progress = await db.progress.create({ progress: progressData })
    await addAgreement(agreementData, progress.progressId)
    const agreement = await checkAgreementExists(agreementData)
    expect(agreement).toMatchObject(
      {
        sbi: 123456789,
        agreementData:
          {
            sbi: 123456789
          },
        progressId: progress.progressId
      }
    )
  })
})
