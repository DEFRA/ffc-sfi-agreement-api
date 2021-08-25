const db = require('../../../../../app/data')

describe('agreement progress route', () => {
  let createServer
  let server
  let progressData
  let progressUrl

  beforeAll(async () => {
    progressData = {
      eligibility: true,
      businessDetails: true
    }
    await db.progress.destroy({ truncate: { cascade: true } })
  })

  beforeEach(async () => {
    createServer = require('../../../../../app/server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  afterAll(async () => {
    await db.progress.destroy({ truncate: { cascade: true } })
    await db.sequelize.close()
  })

  test('POST /agreement/progress returns 201', async () => {
    await db.progress.create({ progress: progressData })
    const options = {
      method: 'POST',
      url: '/agreement/progress',
      payload: progressData
    }

    const result = await server.inject(options)
    progressUrl = result.headers.location
    expect(result.statusCode).toBe(201)
  })

  test('POST /agreement/progress returns 400', async () => {
    await db.progress.create({ progress: progressData })
    const options = {
      method: 'POST',
      url: '/agreement/progress',
      payload: {}
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test('GET /agreement/progress/ returns 200', async () => {
    const options = {
      method: 'GET',
      url: progressUrl
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('GET /agreement/progress/ returns 400', async () => {
    const options = {
      method: 'GET',
      url: '/agreement/progress/abc'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test('GET /agreement/progress/ returns 404', async () => {
    const options = {
      method: 'GET',
      url: '/agreement/progress/99'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(404)
  })

  test('PUT /agreement/progress/ returns 204', async () => {
    progressData.eligibility = false

    await db.progress.create({ progress: progressData })
    const options = {
      method: 'PUT',
      url: progressUrl,
      payload: progressData
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(204)
  })

  test('PUT /agreement/progress returns 400', async () => {
    await db.progress.create({ progress: progressData })
    const options = {
      method: 'PUT',
      url: progressUrl,
      payload: {}
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })
})
