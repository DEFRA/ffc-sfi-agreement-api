const db = require('../data')

async function getAgreements () {
  return db.agreement.findAll()
}

async function getAgreement (agreementId) {
  return db.agreement.findOne({
    raw: true,
    where: { agreementId }
  })
}

async function saveAgreement (agreement, progressId) {
  await db.sequelize.transaction(async (transaction) => {
    const existingAgreement = await db.agreement.findOne({ where: { sbi: agreement.sbi } }, { transaction })
    if (!existingAgreement) {
      await db.agreement.create({ sbi: agreement.sbi, agreementData: agreement, progressId }, { transaction })
      console.info(`Saved agreement: ${agreement.sbi}`)
    } else {
      await db.agreement.update({ agreementData: agreement, progressId, statusId: agreement.statusId ?? 1 }, { where: { sbi: agreement.sbi }, transaction: transaction })
      console.info(`Updated agreement: ${agreement.sbi}`)
    }
  })
}

async function deleteAgreement (agreement) {
  await db.agreement.update({ statusId: 4 }, { where: { sbi: agreement.sbi } })
}

module.exports = {
  getAgreements,
  getAgreement,
  saveAgreement,
  deleteAgreement
}
