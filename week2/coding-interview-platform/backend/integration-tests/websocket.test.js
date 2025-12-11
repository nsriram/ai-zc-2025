import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals'
import request from 'supertest'
import { io as ioClient } from 'socket.io-client'
import { app, server, io, sessions, sessionUsers } from '../server.js'

const BASE_URL = 'http://localhost:3000'
let serverInstance
let clientSocket1
let clientSocket2

beforeAll(async () => {
  // Start the server
  await new Promise((resolve) => {
    serverInstance = server.listen(3000, resolve)
  })

  // Additional wait to ensure server is fully initialized
  await new Promise(resolve => setTimeout(resolve, 500))
}, 15000)

afterAll(async () => {
  // Disconnect all client sockets first
  if (clientSocket1?.connected) {
    clientSocket1.disconnect()
  }
  if (clientSocket2?.connected) {
    clientSocket2.disconnect()
  }

  // Wait a bit for disconnections to process
  await new Promise(resolve => setTimeout(resolve, 100))

  // Disconnect all server-side sockets
  io.disconnectSockets(true)

  // Close Socket.IO server
  await new Promise((resolve) => {
    io.close(resolve)
  })

  // Close HTTP server
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
}, 15000)

beforeEach(() => {
  // Create fresh client sockets for each test
  clientSocket1 = ioClient(BASE_URL, {
    transports: ['websocket']
  })
  clientSocket2 = ioClient(BASE_URL, {
    transports: ['websocket']
  })
})

afterEach(() => {
  // Disconnect sockets after each test
  if (clientSocket1?.connected) {
    clientSocket1.disconnect()
  }
  if (clientSocket2?.connected) {
    clientSocket2.disconnect()
  }
})

async function createSession(name, language) {
  const response = await request(app)
    .post('/api/sessions')
    .send({ name, language })
  return response.body
}

function waitForEvent(socket, eventName, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event: ${eventName}`))
    }, timeout)

    socket.once(eventName, (data) => {
      clearTimeout(timer)
      resolve(data)
    })
  })
}

describe('WebSocket Integration Tests', () => {
  describe('Connection and join-session', () => {
    test('should connect to WebSocket server', async () => {
      await new Promise((resolve, reject) => {
        clientSocket1.on('connect', resolve)
        clientSocket1.on('connect_error', reject)
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      })

      expect(clientSocket1.connected).toBe(true)
    })

    test('should join a session and receive initial code', async () => {
      const session = await createSession('WebSocket Test', 'javascript')

      await new Promise((resolve) => {
        clientSocket1.on('connect', resolve)
      })

      const codeUpdatePromise = waitForEvent(clientSocket1, 'code-update')
      const languageChangePromise = waitForEvent(clientSocket1, 'language-change')

      clientSocket1.emit('join-session', { sessionId: session.id })

      const [codeUpdate, languageChange] = await Promise.all([
        codeUpdatePromise,
        languageChangePromise
      ])

      expect(codeUpdate).toHaveProperty('code')
      expect(codeUpdate.code).toContain('JavaScript code')
      expect(languageChange).toHaveProperty('language', 'javascript')
    })

    test('should broadcast users-update when user joins', async () => {
      const session = await createSession('Users Test', 'javascript')

      await Promise.all([
        new Promise((resolve) => clientSocket1.on('connect', resolve)),
        new Promise((resolve) => clientSocket2.on('connect', resolve))
      ])

      const usersUpdatePromise1 = waitForEvent(clientSocket1, 'users-update')
      clientSocket1.emit('join-session', { sessionId: session.id })

      const usersUpdate1 = await usersUpdatePromise1
      expect(usersUpdate1).toHaveProperty('users')
      expect(Array.isArray(usersUpdate1.users)).toBe(true)
      expect(usersUpdate1.users.length).toBe(1)

      const usersUpdatePromise2 = waitForEvent(clientSocket1, 'users-update')
      clientSocket2.emit('join-session', { sessionId: session.id })

      const usersUpdate2 = await usersUpdatePromise2
      expect(usersUpdate2.users.length).toBe(2)
    })
  })

  describe('code-change events', () => {
    test('should broadcast code changes to other users', async () => {
      const session = await createSession('Code Change Test', 'javascript')

      await Promise.all([
        new Promise((resolve) => clientSocket1.on('connect', resolve)),
        new Promise((resolve) => clientSocket2.on('connect', resolve))
      ])

      // Both clients join the session
      clientSocket1.emit('join-session', { sessionId: session.id })
      await waitForEvent(clientSocket1, 'code-update')

      clientSocket2.emit('join-session', { sessionId: session.id })
      await waitForEvent(clientSocket2, 'code-update')

      // Client1 changes code, Client2 should receive the update
      const newCode = 'console.log("Hello from client1");'
      const codeUpdatePromise = waitForEvent(clientSocket2, 'code-update')

      clientSocket1.emit('code-change', {
        sessionId: session.id,
        code: newCode
      })

      const codeUpdate = await codeUpdatePromise
      expect(codeUpdate.code).toBe(newCode)
      expect(codeUpdate).toHaveProperty('userId')
    })

    test('should not send code update back to sender', async () => {
      const session = await createSession('Code Echo Test', 'javascript')

      await new Promise((resolve) => clientSocket1.on('connect', resolve))
      clientSocket1.emit('join-session', { sessionId: session.id })
      await waitForEvent(clientSocket1, 'code-update')

      let receivedUpdate = false
      clientSocket1.on('code-update', () => {
        receivedUpdate = true
      })

      clientSocket1.emit('code-change', {
        sessionId: session.id,
        code: 'console.log("test");'
      })

      await new Promise(resolve => setTimeout(resolve, 500))
      expect(receivedUpdate).toBe(false)
    })

    test('should persist code changes in session', async () => {
      const session = await createSession('Persist Test', 'javascript')

      await new Promise((resolve) => clientSocket1.on('connect', resolve))
      clientSocket1.emit('join-session', { sessionId: session.id })
      await waitForEvent(clientSocket1, 'code-update')

      const newCode = 'console.log("Persisted code");'
      clientSocket1.emit('code-change', {
        sessionId: session.id,
        code: newCode
      })

      await new Promise(resolve => setTimeout(resolve, 500))

      // Verify via REST API that code was persisted
      const response = await request(app)
        .get(`/api/sessions/${session.id}`)

      expect(response.body.code).toBe(newCode)
    })
  })

  describe('language-change events', () => {
    test('should broadcast language changes to other users', async () => {
      const session = await createSession('Language Test', 'javascript')

      await Promise.all([
        new Promise((resolve) => clientSocket1.on('connect', resolve)),
        new Promise((resolve) => clientSocket2.on('connect', resolve))
      ])

      clientSocket1.emit('join-session', { sessionId: session.id })
      await waitForEvent(clientSocket1, 'language-change')

      clientSocket2.emit('join-session', { sessionId: session.id })
      await waitForEvent(clientSocket2, 'language-change')

      const languageChangePromise = waitForEvent(clientSocket2, 'language-change')

      clientSocket1.emit('language-change', {
        sessionId: session.id,
        language: 'python'
      })

      const languageChange = await languageChangePromise
      expect(languageChange.language).toBe('python')
    })

    test('should persist language changes in session', async () => {
      const session = await createSession('Language Persist Test', 'javascript')

      await new Promise((resolve) => clientSocket1.on('connect', resolve))
      clientSocket1.emit('join-session', { sessionId: session.id })
      await waitForEvent(clientSocket1, 'language-change')

      clientSocket1.emit('language-change', {
        sessionId: session.id,
        language: 'typescript'
      })

      await new Promise(resolve => setTimeout(resolve, 500))

      // Verify via REST API that language was persisted
      const response = await request(app)
        .get(`/api/sessions/${session.id}`)

      expect(response.body.language).toBe('typescript')
    })
  })

  describe('disconnect events', () => {
    test('should update users list when user disconnects', async () => {
      const session = await createSession('Disconnect Test', 'javascript')

      await Promise.all([
        new Promise((resolve) => clientSocket1.on('connect', resolve)),
        new Promise((resolve) => clientSocket2.on('connect', resolve))
      ])

      clientSocket1.emit('join-session', { sessionId: session.id })
      await waitForEvent(clientSocket1, 'users-update')

      clientSocket2.emit('join-session', { sessionId: session.id })
      await waitForEvent(clientSocket2, 'users-update')

      // Wait for stabilization
      await new Promise(resolve => setTimeout(resolve, 300))

      const usersUpdatePromise = waitForEvent(clientSocket2, 'users-update')
      clientSocket1.disconnect()

      const usersUpdate = await usersUpdatePromise
      expect(usersUpdate.users.length).toBe(1)
    })
  })

  describe('Multiple users collaboration', () => {
    test('should handle multiple users editing simultaneously', async () => {
      const session = await createSession('Multi User Test', 'javascript')

      await Promise.all([
        new Promise((resolve) => clientSocket1.on('connect', resolve)),
        new Promise((resolve) => clientSocket2.on('connect', resolve))
      ])

      // Both join
      clientSocket1.emit('join-session', { sessionId: session.id })
      clientSocket2.emit('join-session', { sessionId: session.id })

      await Promise.all([
        waitForEvent(clientSocket1, 'code-update'),
        waitForEvent(clientSocket2, 'code-update')
      ])

      // Set up listeners
      const client1Updates = []
      const client2Updates = []

      clientSocket1.on('code-update', (data) => client1Updates.push(data))
      clientSocket2.on('code-update', (data) => client2Updates.push(data))

      // Client 2 makes a change
      clientSocket2.emit('code-change', {
        sessionId: session.id,
        code: 'const x = 1;'
      })

      await new Promise(resolve => setTimeout(resolve, 300))

      // Client 1 makes a change
      clientSocket1.emit('code-change', {
        sessionId: session.id,
        code: 'const y = 2;'
      })

      await new Promise(resolve => setTimeout(resolve, 300))

      expect(client1Updates.length).toBeGreaterThan(0)
      expect(client2Updates.length).toBeGreaterThan(0)
      expect(client1Updates[0].code).toBe('const x = 1;')
      expect(client2Updates[0].code).toBe('const y = 2;')
    })
  })
})
