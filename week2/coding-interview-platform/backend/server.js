import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
})

app.use(cors())
app.use(express.json())

// Serve static files from frontend build (for production/Docker)
const frontendBuildPath = path.join(__dirname, '../frontend/dist')
app.use(express.static(frontendBuildPath))

const sessions = new Map()
const sessionUsers = new Map()

function getDefaultCode(language) {
  const templates = {
    javascript: `// JavaScript code
function greet(name) {
  console.log('Hello, ' + name + '!');
}

greet('World');`,
    python: `# Python code
def greet(name):
    print(f'Hello, {name}!')

greet('World')`,
    java: `// Java code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    cpp: `// C++ code
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    go: `// Go code
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
    typescript: `// TypeScript code
function greet(name: string): void {
  console.log(\`Hello, \${name}!\`);
}

greet('World');`,
  }
  return templates[language] || '// Start coding here...'
}

app.post('/api/sessions', (req, res) => {
  const { name, language } = req.body

  if (!name || !language) {
    return res.status(400).json({
      error: 'Name and language are required',
      code: 'INVALID_REQUEST'
    })
  }

  const sessionId = uuidv4().split('-')[0]
  const session = {
    id: sessionId,
    name,
    language,
    code: getDefaultCode(language),
    createdAt: new Date().toISOString()
  }

  sessions.set(sessionId, session)
  sessionUsers.set(sessionId, [])

  res.status(201).json(session)
})

app.get('/api/sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params
  const session = sessions.get(sessionId)

  if (!session) {
    return res.status(404).json({
      error: 'Session not found',
      code: 'SESSION_NOT_FOUND'
    })
  }

  const users = sessionUsers.get(sessionId) || []
  res.json({ ...session, users })
})

app.patch('/api/sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params
  const { code, language } = req.body

  const session = sessions.get(sessionId)
  if (!session) {
    return res.status(404).json({
      error: 'Session not found',
      code: 'SESSION_NOT_FOUND'
    })
  }

  if (code !== undefined) {
    session.code = code
  }
  if (language !== undefined) {
    session.language = language
  }

  sessions.set(sessionId, session)
  res.json(session)
})

app.get('/api/sessions/:sessionId/users', (req, res) => {
  const { sessionId } = req.params
  const users = sessionUsers.get(sessionId) || []

  res.json({ users })
})

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on('join-session', ({ sessionId }) => {
    console.log(`User ${socket.id} joining session ${sessionId}`)

    socket.join(sessionId)

    const users = sessionUsers.get(sessionId) || []
    const user = {
      id: socket.id,
      joinedAt: new Date().toISOString()
    }
    users.push(user)
    sessionUsers.set(sessionId, users)

    socket.data.sessionId = sessionId

    io.to(sessionId).emit('users-update', { users })

    const session = sessions.get(sessionId)
    if (session) {
      socket.emit('code-update', { code: session.code })
      socket.emit('language-change', { language: session.language })
    }
  })

  socket.on('code-change', ({ sessionId, code }) => {
    console.log(`Code change in session ${sessionId}`)

    const session = sessions.get(sessionId)
    if (session) {
      session.code = code
      sessions.set(sessionId, session)
    }

    socket.to(sessionId).emit('code-update', {
      code,
      userId: socket.id
    })
  })

  socket.on('language-change', ({ sessionId, language }) => {
    console.log(`Language change in session ${sessionId} to ${language}`)

    const session = sessions.get(sessionId)
    if (session) {
      session.language = language
      sessions.set(sessionId, session)
    }

    socket.to(sessionId).emit('language-change', { language })
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)

    const sessionId = socket.data.sessionId
    if (sessionId) {
      const users = sessionUsers.get(sessionId) || []
      const updatedUsers = users.filter(user => user.id !== socket.id)
      sessionUsers.set(sessionId, updatedUsers)

      io.to(sessionId).emit('users-update', { users: updatedUsers })
    }
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
    socket.emit('error', { message: 'An error occurred' })
  })
})

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    sessions: sessions.size,
    timestamp: new Date().toISOString()
  })
})

// Serve index.html for all other routes (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'))
})

const PORT = process.env.PORT || 3000

// Only start the server if this file is run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/health`)
  })
}

// Export for testing
export { app, server, io, sessions, sessionUsers }