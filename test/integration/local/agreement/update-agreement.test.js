const db = require('../../../../app/data')
const generateAgreementNumber = require('../../../../app/agreement-number')
const { updateAgreement } = require('../../../../app/agreement')

let agreementData
let progressData
let agreementNumber

describe('update Agreement', () => {
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

  test('should update 1 agreement', async () => {
    const progress = await db.progress.create({ progress: progressData })
    await db.agreement.create({ agreementNumber, sbi: agreementData.sbi, agreementData, progressId: progress.progressId })
    const agreement = await db.agreement.findOne({ raw: true, where: { agreementNumber, sbi: agreementData.sbi } })

    agreement.paymentAmount = 200

    await updateAgreement(agreement, 1)

    expect(agreement).toMatchObject(
      {
        paymentAmount: 200
      }
    )
  })
})
