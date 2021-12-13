const db = require('../../../../app/data')
const { getAgreement } = require('../../../../app/agreement')

let agreementData
let agreementNumber

describe('get Agreement', () => {
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

  test('should return 1 agreement', async () => {
    await db.agreement.create({ agreementNumber, sbi: agreementData.organisation.sbi, agreementData })
    const agreement = await getAgreement(agreementNumber, agreementData.organisation.sbi)
    expect(agreement).toMatchObject(
      {
        agreementNumber,
        sbi: agreementData.organisation.sbi,
        agreementData
      }
    )
  })

  test('should return no agreement', async () => {
    const agreement = await getAgreement(agreementNumber, agreementData.organisation.sbi)
    expect(agreement).toBe(null)
  })
})
