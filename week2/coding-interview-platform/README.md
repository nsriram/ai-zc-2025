# Coding Interview Platform

A real-time collaborative coding interview platform built with React and Express.js. Multiple users can join a session via a shared link and edit code together in real-time with syntax highlighting and in-browser execution.

## Features

- **Real-time Collaboration**: Multiple users can edit code simultaneously with instant synchronization
- **Session Management**: Create shareable links for interview sessions
- **Multi-language Support**: Syntax highlighting for JavaScript, Python, Java, C++, Go, and TypeScript
- **Code Execution**: Run JavaScript and Python code safely in the browser using WASM (Pyodide)
- **User Presence**: See how many users are connected to a session
- **Modern UI**: Clean, VS Code-inspired interface with Monaco Editor

## Project Structure

```
coding-interview-platform/
├── frontend/                      # React application
│   ├── src/
│   │   ├── components/                 # React components
│   │   ├── api/                       # API client (mock)
│   │   └── services/                  # WebSocket service
│   ├── integration-tests/         # Frontend browser automation tests
│   │   ├── tests/
│   │   │   ├── session-creation.spec.js
│   │   │   ├── code-editing.spec.js
│   │   │   └── realtime-collaboration.spec.js
│   │   └── package.json
│   └── package.json
├── backend/                       # Express.js server
│   ├── server.js                      # Main server file
│   ├── integration-tests/         # Backend integration tests
│   │   ├── api.test.js                # REST API tests
│   │   ├── websocket.test.js          # WebSocket tests
│   │   └── package.json
│   └── package.json
├── docs/                          # API documentation
│   └── openapi.yaml                   # OpenAPI 3.0 specification
├── Dockerfile                     # Docker configuration
├── .dockerignore                  # Docker ignore file
└── package.json                   # Root package.json (concurrently)
```

## Quick Start

### Option 1: Docker (Recommended for Production)

The easiest way to run the application is using Docker, which packages both frontend and backend in a single container.

#### Prerequisites
- Docker installed on your system

#### Build and Run
```bash
# Build the Docker image
docker build -t coding-interview-platform .

# Run the container (interactive mode, auto-removes on stop)
docker run --rm -it -p 3000:3000 --name coding-interview coding-interview-platform

# Or run in detached mode (background)
docker run -d -p 3000:3000 --name coding-interview coding-interview-platform
```

The application will be available at http://localhost:3000

#### Stop the Container
```bash
# If running in interactive mode: Press Ctrl+C

# If running in detached mode:
docker stop coding-interview

# Force remove if needed
docker rm -f coding-interview
```

### Option 2: Run Both Servers Concurrently

From the root directory:

```bash
# Install dependencies for all packages
npm run install:all

# Run both backend and frontend simultaneously
npm run dev
```

This will start:
- Backend server on http://localhost:3000
- Frontend app on http://localhost:3001

### Option 3: Run Servers Separately

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
npm start
```

Server will run on http://localhost:3000

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:3001

## Usage

### For Docker (Option 1)
1. Open http://localhost:3000 in your browser

### For Development Mode (Options 2 & 3)
1. Open http://localhost:3001 in your browser

### Common Steps
2. Create a new interview session by entering:
   - Session name
   - Programming language
3. Click "Create Session" - the link will be copied to clipboard
4. Share the link with interview candidates
5. All connected users can:
   - Edit code in real-time
   - See changes from other users instantly
   - Change the programming language
   - Run JavaScript and Python code in the browser

## Technology Stack

### Frontend
- React 18
- Vite (build tool)
- Monaco Editor (VS Code editor)
- Socket.IO Client (WebSocket)
- React Router (routing)
- Pyodide (Python WASM runtime)

### Backend
- Express.js (web framework)
- Socket.IO (WebSocket server)
- Node.js
- In-memory storage (Map)

### API
- REST API for session management
- WebSocket for real-time updates
- OpenAPI 3.0 specification

### Deployment
- Docker (containerization)
- Concurrently (development multi-process)

## API Documentation

See `docs/openapi.yaml` for complete API specification.

### Key Endpoints

- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get session details
- `PATCH /api/sessions/:id` - Update session
- `GET /health` - Health check

### WebSocket Events

- `join-session` - Join a session
- `code-change` - Sync code changes
- `language-change` - Sync language changes
- `users-update` - User presence updates

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

The backend uses Node's `--watch` flag for auto-reload during development.

## Testing

The platform includes comprehensive integration tests for both backend and frontend.

### Backend Integration Tests

Backend tests validate REST API endpoints and WebSocket functionality.

#### Setup
```bash
cd backend/integration-tests
npm install
```

#### Run Tests
```bash
# Run all backend integration tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

#### Coverage
- REST API endpoints (POST, GET, PATCH sessions; health check)
- WebSocket events (join, code changes, language changes, disconnect)
- Multi-user collaboration
- Session state persistence

See `backend/integration-tests/README.md` for detailed documentation.

### Frontend Integration Tests

Frontend tests use Playwright for browser automation to simulate real user interactions.

#### Setup
```bash
cd frontend/integration-tests
npm install
npx playwright install chromium
```

#### Run Tests
```bash
# Run all frontend tests (headless)
npm test

# Run tests with visible browser
npm run test:headed

# Run tests with interactive UI
npm run test:ui

# Debug tests
npm run test:debug
```

#### Coverage
- Session creation and navigation
- Code editor functionality (typing, language switching)
- Real-time collaboration between multiple users
- User presence tracking
- Code persistence across page reloads

See `frontend/integration-tests/README.md` for detailed documentation.

## Architecture

### Real-time Synchronization Flow

1. User joins session → connects to WebSocket
2. User edits code → emits `code-change` event
3. Server receives event → broadcasts to other users
4. Other users receive `code-update` → editor updates

### Session Management

- Sessions stored in-memory (Map data structure)
- Each session has unique ID, name, language, and code
- User presence tracked per session
- Automatic cleanup on user disconnect

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari

Monaco Editor requires modern browser with ES6 support.

## Limitations

- In-browser code execution only supports JavaScript and Python (via Pyodide WASM)
- Data is lost on server restart (in-memory storage)
- No authentication/authorization
- No session persistence

## Deployment

### Deploy to Render.com (Free Tier)

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Render Account**
   - Sign up at https://render.com/
   - Connect your Git provider

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Select your repository
   - Configure:
     - **Name**: `coding-interview-platform`
     - **Environment**: `Docker`
     - **Region**: Choose closest region
     - **Branch**: `main`
     - **Instance Type**: `Free`

4. **Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for build
   - Access via provided URL

**Note**: Free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up.

## Production Considerations

To make this production-ready:

1. **Add persistent storage** (MongoDB, PostgreSQL, or Redis)
2. **Implement authentication** (JWT, OAuth)
3. **Add rate limiting** to prevent abuse
4. **Enable HTTPS** for secure connections (automatic on Render)
5. **Add input validation** and sanitization
6. **Implement session expiration** and cleanup
7. **Add logging and monitoring**
8. **Use environment variables** for configuration
9. **Add code execution sandbox** for other languages
10. **Consider paid hosting** for no cold starts and more resources

## License

MIT

## Contributing

Pull requests are welcome! Please ensure your code follows the existing style.

## Support

For issues and questions, please open a GitHub issue.