const db = require('../../../../app/data')
const { addAgreement, checkAgreementExists } = require('../../../../app/agreement')

let agreementData
let agreementNumber

describe('add Agreement', () => {
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

  test('should add 1 agreement', async () => {
    await addAgreement(agreementData)
    const agreement = await checkAgreementExists({ agreementNumber, sbi: agreementData.organisation.sbi })
    expect(agreement).toMatchObject(
      {
        agreementData: {
          organisation: {
            sbi: 123456789
          }
        }
      }
    )
  })
})
