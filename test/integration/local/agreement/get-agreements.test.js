const db = require('../../../../app/data')
const { getAgreements } = require('../../../../app/agreement')

let agreementData
let agreementNumber

describe('get Agreements', () => {
  beforeEach(async () => {
    agreementNumber = 'AG123456789'
    agreementData = {
      agreementNumber,
      crn: '1234567890',
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

  test('should return 2 agreements', async () => {
    await db.agreement.create({ agreementNumber, sbi: agreementData.organisation.sbi, agreementData })
    const agreement = await getAgreements()
    expect(agreement.length).toBe(1)
  })

  test('should return 0 agreements', async () => {
    const agreement = await getAgreements()
    expect(agreement.length).toBe(0)
  })
})
