const db = require('../data')
const generateAgreementNumber = require('../agreement-number')

const getAgreements = async () => {
  return db.agreement.findAll()
}

const getAgreement = async (agreementNumber, sbi) => {
  return db.agreement.findOne({
    raw: true,
    where: { agreementNumber, sbi }
  })
}

const addAgreement = async (agreement, progressId) => {
  const agreementNumber = generateAgreementNumber()
  await db.agreement.create({ agreementNumber, sbi: agreement.sbi, agreementData: agreement, progressId })
  console.info(`Saved agreement: ${agreementNumber}`)
  return agreementNumber
}

const updateAgreement = async (agreement) => {
  await db.agreement.update({ agreementData: agreement, statusId: agreement.statusId ?? 1 }, { where: { agreementNumber: agreement.agreementNumber, sbi: agreement.sbi } })
  console.info(`Updated agreement: ${agreement.sbi}`)
}

const checkAgreementExists = async (agreement) => {
  return db.agreement.findOne({ where: { sbi: agreement.sbi, agreementNumber: agreement.agreementNumber } })
}

module.exports = {
  getAgreements,
  getAgreement,
  addAgreement,
  updateAgreement,
  checkAgreementExists
}
