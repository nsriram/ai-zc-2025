# Backend Integration Tests

This directory contains backend integration tests that validate the REST API endpoints and WebSocket functionality of the coding interview platform.

## Test Structure

- `api.test.js` - Tests for REST API endpoints
- `websocket.test.js` - Tests for WebSocket real-time collaboration

## Prerequisites

Make sure backend dependencies are installed:

```bash
cd ..
npm install
```

## Installation

Install test dependencies:

```bash
cd integration-tests
npm install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Test Coverage

### REST API Tests (`api.test.js`)

- **POST /api/sessions**
  - Create session with valid data
  - Validate error handling for missing fields
  - Test multiple programming languages

- **GET /api/sessions/:id**
  - Retrieve existing session
  - Handle non-existent sessions

- **PATCH /api/sessions/:id**
  - Update session code
  - Update session language
  - Update both code and language
  - Handle non-existent sessions

- **GET /api/sessions/:id/users**
  - Get active users in session

- **GET /health**
  - Verify health check endpoint

### WebSocket Tests (`websocket.test.js`)

- **Connection and Join**
  - Connect to WebSocket server
  - Join session and receive initial state
  - Broadcast user presence updates

- **Code Changes**
  - Broadcast code changes to other users
  - Verify sender doesn't receive echo
  - Persist changes in session state

- **Language Changes**
  - Broadcast language changes to other users
  - Persist language changes in session state

- **Disconnect**
  - Update user list on disconnect

- **Multi-user Collaboration**
  - Handle multiple users editing simultaneously

## Notes

- Tests automatically start and stop the backend server
- Each test suite uses a clean server instance
- WebSocket tests include proper cleanup between tests
- Tests run on port 3000 to avoid conflicts

## Troubleshooting

If tests fail:

1. Make sure no other process is using port 3000
2. Ensure backend dependencies are installed
3. Check that Node.js version supports ES modules
4. Try running with `--verbose` flag for detailed output