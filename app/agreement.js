const db = require('./data')

const getAgreements = async () => {
  return db.agreement.findAll({
    include: [{ model: db.status, as: 'status' }]
  })
}

const getAgreementBySbi = async (sbi) => {
  return db.agreement.findAll({
    include: [{ model: db.status, as: 'status' }],
    where: { sbi }
  })
}

const getAgreementByNumberAndSbi = async (agreementNumber, sbi) => {
  return db.agreement.findOne({
    include: [{ model: db.status, as: 'status' }],
    where: { agreementNumber, sbi }
  })
}

const addAgreement = async (agreement) => {
  const { agreementNumber, crn, organisation } = agreement
  await db.agreement.create({ agreementNumber, crn, statusId: agreement.statusId ?? 1, sbi: organisation.sbi, agreementData: agreement })
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
  getAgreementByNumberAndSbi,
  addAgreement,
  updateAgreement,
  checkAgreementExists
}
