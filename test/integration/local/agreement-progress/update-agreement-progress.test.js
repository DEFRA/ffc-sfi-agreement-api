const db = require('../../../../app/data')
const { updateProgress } = require('../../../../app/agreement-progress')

let progressData

describe('update Agreement Progress', () => {
  beforeEach(async () => {
    progressData = {
      eligibility: true,
      businessDetails: true
    }

    await db.progress.destroy({ truncate: { cascade: true } })
  })

  afterAll(async () => {
    await db.progress.destroy({ truncate: { cascade: true } })
    await db.sequelize.close()
  })

  test('should update 1 agreement progress', async () => {
    const addedProgress = await db.progress.create({ progress: progressData })
    const progress = await db.progress.findOne({ raw: true, where: { progressId: addedProgress.progressId } })

    progress.progress.eligibility = false

    await updateProgress(progress.progress, addedProgress.progressId)

    expect(progress).toMatchObject(
      {
        progressId: addedProgress.progressId,
        progress: {
          eligibility: false
        }
      }
    )
  })
})
