const db = require('../../../../app/data')
const { getProgress } = require('../../../../app/agreement-progress')

let progressData

describe('get Agreement Progress', () => {
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

  test('should return 1 agreement progress', async () => {
    const addedProgress = await db.progress.create({ progress: progressData })
    const progress = await getProgress(addedProgress.progressId)
    expect(progress).toMatchObject(
      {
        progressId: addedProgress.progressId,
        progress: progressData
      }
    )
  })

  test('should return no agreement progress', async () => {
    const progress = await getProgress(99)
    expect(progress).toBe(null)
  })
})
