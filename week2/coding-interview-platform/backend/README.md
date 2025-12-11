# Coding Interview Platform - Backend

ExpressJS backend server with WebSocket support for real-time collaborative coding interviews.

## Features

- RESTful API for session management
- WebSocket support for real-time code synchronization
- In-memory session storage
- Multiple concurrent sessions support
- User presence tracking
- CORS enabled for cross-origin requests

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional):
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on http://localhost:5000

## API Endpoints

### REST API

- **POST /api/sessions** - Create a new session
  ```json
  {
    "name": "Frontend Interview",
    "language": "javascript"
  }
  ```

- **GET /api/sessions/:sessionId** - Get session details

- **PATCH /api/sessions/:sessionId** - Update session
  ```json
  {
    "code": "console.log('Hello');",
    "language": "javascript"
  }
  ```

- **GET /api/sessions/:sessionId/users** - Get active users

- **GET /health** - Health check endpoint

### WebSocket Events

#### Client Events (from client to server):
- `join-session` - Join a session room
- `code-change` - Broadcast code changes
- `language-change` - Change programming language

#### Server Events (from server to client):
- `code-update` - Code has been updated
- `users-update` - User list has changed
- `language-change` - Language has been changed
- `error` - Error notification

## Data Storage

Uses in-memory Maps for:
- `sessions` - Stores session data (id, name, language, code)
- `sessionUsers` - Tracks active users per session

Note: Data is lost when server restarts. For production, use a database like MongoDB or Redis.

## Technologies

- Express.js - Web framework
- Socket.IO - WebSocket library
- uuid - Unique ID generation
- cors - CORS middleware

## Architecture

```
server.js
├── Express HTTP Server
│   ├── REST API routes
│   └── CORS middleware
└── Socket.IO WebSocket Server
    ├── Connection handling
    ├── Room management
    └── Event broadcasting
```

## Testing

Test the API using curl:

```bash
# Create a session
curl -X POST http://localhost:5000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Session","language":"javascript"}'

# Get session
curl http://localhost:5000/api/sessions/{sessionId}

# Health check
curl http://localhost:5000/health
```

## Production Considerations

For production deployment:
1. Add authentication/authorization
2. Implement persistent storage (MongoDB, PostgreSQL, Redis)
3. Add rate limiting
4. Enable HTTPS
5. Add logging and monitoring
6. Implement session cleanup/expiration
7. Add input validation and sanitization
8. Set up proper error handling