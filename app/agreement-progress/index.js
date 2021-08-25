const db = require('../data')

const getProgress = async (progressId) => {
  return db.progress.findOne({
    raw: true,
    where: { progressId }
  })
}

const addProgress = async (progress) => {
  let addedProgress
  await db.sequelize.transaction(async (transaction) => {
    addedProgress = await db.progress.create({ progress }, { transaction })
    console.info(`Saved progress: ${addedProgress.progressId}`)
  })
  return addedProgress.progressId
}

const updateProgress = async (progress, progressId) => {
  await db.sequelize.transaction(async (transaction) => {
    await db.progress.update({ progress }, { where: { progressId }, transaction: transaction })
    console.info(`Updated progress: ${progressId}`)
  })
}

module.exports = {
  getProgress,
  addProgress,
  updateProgress
}
