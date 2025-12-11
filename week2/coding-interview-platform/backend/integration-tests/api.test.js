import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import request from 'supertest'
import { app, server, sessions, sessionUsers } from '../server.js'

const BASE_URL = 'http://localhost:3000'
let serverInstance

beforeAll(async () => {
  // Start the server
  await new Promise((resolve) => {
    serverInstance = server.listen(3000, resolve)
  })
})

afterAll(async () => {
  // Close server and clean up
  await new Promise((resolve) => {
    if (serverInstance) {
      serverInstance.close(resolve)
    } else {
      resolve()
    }
  })

  // Clear sessions
  sessions.clear()
  sessionUsers.clear()
})

describe('REST API Integration Tests', () => {
  describe('POST /api/sessions', () => {
    test('should create a new session with valid data', async () => {
      const response = await request(app)
        .post('/api/sessions')
        .send({
          name: 'Test Interview Session',
          language: 'javascript'
        })
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('name', 'Test Interview Session')
      expect(response.body).toHaveProperty('language', 'javascript')
      expect(response.body).toHaveProperty('code')
      expect(response.body).toHaveProperty('createdAt')
      expect(response.body.code).toContain('JavaScript code')
    })

    test('should return 400 when name is missing', async () => {
      const response = await request(app)
        .post('/api/sessions')
        .send({
          language: 'javascript'
        })
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body).toHaveProperty('code', 'INVALID_REQUEST')
    })

    test('should return 400 when language is missing', async () => {
      const response = await request(app)
        .post('/api/sessions')
        .send({
          name: 'Test Session'
        })
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body).toHaveProperty('code', 'INVALID_REQUEST')
    })

    test('should create sessions with different languages', async () => {
      const languages = ['javascript', 'python', 'java', 'cpp', 'go', 'typescript']

      for (const language of languages) {
        const response = await request(app)
          .post('/api/sessions')
          .send({
            name: `${language} Session`,
            language
          })
          .expect(201)

        expect(response.body.language).toBe(language)
        expect(response.body.code).toBeTruthy()
      }
    })
  })

  describe('GET /api/sessions/:sessionId', () => {
    let sessionId

    beforeAll(async () => {
      // Create a session for testing
      const response = await request(app)
        .post('/api/sessions')
        .send({
          name: 'Get Test Session',
          language: 'javascript'
        })
      sessionId = response.body.id
    })

    test('should retrieve an existing session', async () => {
      const response = await request(app)
        .get(`/api/sessions/${sessionId}`)
        .expect(200)

      expect(response.body).toHaveProperty('id', sessionId)
      expect(response.body).toHaveProperty('name', 'Get Test Session')
      expect(response.body).toHaveProperty('language', 'javascript')
      expect(response.body).toHaveProperty('code')
      expect(response.body).toHaveProperty('users')
      expect(Array.isArray(response.body.users)).toBe(true)
    })

    test('should return 404 for non-existent session', async () => {
      const response = await request(app)
        .get('/api/sessions/nonexistent123')
        .expect(404)

      expect(response.body).toHaveProperty('error')
      expect(response.body).toHaveProperty('code', 'SESSION_NOT_FOUND')
    })
  })

  describe('PATCH /api/sessions/:sessionId', () => {
    let sessionId

    beforeAll(async () => {
      // Create a session for testing
      const response = await request(app)
        .post('/api/sessions')
        .send({
          name: 'Patch Test Session',
          language: 'javascript'
        })
      sessionId = response.body.id
    })

    test('should update session code', async () => {
      const newCode = 'console.log("Updated code");'
      const response = await request(app)
        .patch(`/api/sessions/${sessionId}`)
        .send({ code: newCode })
        .expect(200)

      expect(response.body.code).toBe(newCode)
      expect(response.body.id).toBe(sessionId)
    })

    test('should update session language', async () => {
      const response = await request(app)
        .patch(`/api/sessions/${sessionId}`)
        .send({ language: 'python' })
        .expect(200)

      expect(response.body.language).toBe('python')
    })

    test('should update both code and language', async () => {
      const newCode = 'print("Hello Python")'
      const response = await request(app)
        .patch(`/api/sessions/${sessionId}`)
        .send({
          code: newCode,
          language: 'python'
        })
        .expect(200)

      expect(response.body.code).toBe(newCode)
      expect(response.body.language).toBe('python')
    })

    test('should return 404 for non-existent session', async () => {
      const response = await request(app)
        .patch('/api/sessions/nonexistent123')
        .send({ code: 'test' })
        .expect(404)

      expect(response.body).toHaveProperty('error')
      expect(response.body).toHaveProperty('code', 'SESSION_NOT_FOUND')
    })
  })

  describe('GET /api/sessions/:sessionId/users', () => {
    let sessionId

    beforeAll(async () => {
      // Create a session for testing
      const response = await request(app)
        .post('/api/sessions')
        .send({
          name: 'Users Test Session',
          language: 'javascript'
        })
      sessionId = response.body.id
    })

    test('should return empty users array for new session', async () => {
      const response = await request(app)
        .get(`/api/sessions/${sessionId}/users`)
        .expect(200)

      expect(response.body).toHaveProperty('users')
      expect(Array.isArray(response.body.users)).toBe(true)
    })
  })

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)

      expect(response.body).toHaveProperty('status', 'ok')
      expect(response.body).toHaveProperty('sessions')
      expect(response.body).toHaveProperty('timestamp')
      expect(typeof response.body.sessions).toBe('number')
    })
  })
})