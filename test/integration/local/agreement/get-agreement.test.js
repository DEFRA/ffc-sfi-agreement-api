const db = require('../../../../app/data')
const { getAgreementByNumberAndSbi } = require('../../../../app/agreement')

let agreementData
let agreementNumber
let crn

describe('get Agreement', () => {
  beforeEach(async () => {
    agreementNumber = 'AG123456789'
    crn = '1234567890'
    agreementData = {
      agreementNumber,
      crn,
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
    await db.agreement.create({ agreementNumber, crn, sbi: agreementData.organisation.sbi, agreementData })
    const agreement = await getAgreementByNumberAndSbi(agreementNumber, agreementData.organisation.sbi)
    expect(agreement).toMatchObject(
      {
        agreementNumber,
        crn: '1234567890',
        sbi: agreementData.organisation.sbi,
        agreementData
      }
    )
  })

  test('should return no agreement', async () => {
    const agreement = await getAgreementByNumberAndSbi(agreementNumber, agreementData.organisation.sbi)
    expect(agreement).toBe(null)
  })
})
