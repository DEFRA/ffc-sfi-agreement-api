const db = require('./data')

const getAgreements = async () => {
  return db.agreement.findAll()
}

const getAgreementBySbi = async (sbi) => {
  return db.agreement.findAll({
    raw: true,
    where: { sbi }
  })
}

const getAgreement = async (agreementNumber, sbi) => {
  return db.agreement.findOne({
    raw: true,
    where: { agreementNumber, sbi }
  })
}

const addAgreement = async (agreement) => {
  const { agreementNumber, crn, organisation } = agreement
  await db.agreement.create({ agreementNumber, crn, sbi: organisation.sbi, agreementData: agreement })
  console.info(`Saved agreement: ${agreementNumber}`)
}

const updateAgreement = async (agreement) => {
  const { agreementNumber, crn, organisation } = agreement
  await db.agreement.update({ agreementData: agreement, crn, statusId: agreement.statusId ?? 1 }, { where: { agreementNumber, sbi: organisation.sbi } })
  console.info(`Updated agreement: ${agreementNumber}`)
}

const checkAgreementExists = async (agreement) => {
  const { agreementNumber, sbi } = agreement
  return db.agreement.findOne({ where: { sbi, agreementNumber } })
}

module.exports = {
  getAgreements,
  getAgreementBySbi,
  getAgreement,
  addAgreement,
  updateAgreement,
  checkAgreementExists
}
