const db = require('../data')

const getProgress = async (progressId) => {
  return db.progress.findOne({
    raw: true,
    where: { progressId }
  })
}

const addProgress = async (progress) => {
  const addedProgress = await db.progress.create({ progress })
  console.info(`Saved progress: ${addedProgress.progressId}`)
  return addedProgress.progressId
}

const updateProgress = async (progress) => {
  const progressId = progress.progressId
  await db.progress.update({ progress: progress.progress }, { where: { progressId } })
  console.info(`Updated progress: ${progressId}`)
}

module.exports = {
  getProgress,
  addProgress,
  updateProgress
}
