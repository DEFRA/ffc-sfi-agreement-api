const db = require('../../../../app/data')
const { addProgress } = require('../../../../app/agreement-progress')

let progressData

describe('add Agreement Progress', () => {
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

  test('should add 1 agreement progress', async () => {
    const progressId = await addProgress(progressData)
    const progress = await db.progress.findOne({ raw: true, where: { progressId } })
    expect(progress).toMatchObject(
      {
        progressId,
        progress: progressData
      }
    )
  })
})
