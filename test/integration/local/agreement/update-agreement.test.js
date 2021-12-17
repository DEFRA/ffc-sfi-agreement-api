const db = require('../../../../app/data')
const { updateAgreement } = require('../../../../app/agreement')

let agreementData
let agreementNumber

describe('update Agreement', () => {
  beforeEach(async () => {
    agreementNumber = 'AG123456789'
    agreementData = {
      agreementNumber,
      organisation: {
        sbi: 123456789
      },
      action: {
        paymentAmount: 100
      }
    }

    await db.agreement.destroy({ truncate: { cascade: true } })
  })

  afterAll(async () => {
    await db.agreement.destroy({ truncate: { cascade: true } })
    await db.sequelize.close()
  })

  test('should update 1 agreement', async () => {
    await db.agreement.create({ agreementNumber, sbi: agreementData.organisation.sbi, agreementData })
    const agreement = await db.agreement.findOne({ raw: true, where: { agreementNumber, sbi: agreementData.organisation.sbi } })

    agreement.agreementData.action.paymentAmount = 200

    await updateAgreement(agreement.agreementData)

    const updatedAgreement = await db.agreement.findOne({ raw: true, where: { agreementNumber, sbi: agreementData.organisation.sbi } })

    expect(updatedAgreement.agreementData.action.paymentAmount).toBe(200)
  })
})
