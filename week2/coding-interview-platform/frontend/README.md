# Coding Interview Platform - Frontend

A real-time collaborative coding interview platform built with React.

## Features

- Real-time collaborative code editing
- Monaco Editor with syntax highlighting
- Support for multiple programming languages (JavaScript, Python, Java, C++, Go, TypeScript)
- WebSocket-based real-time synchronization
- In-browser JavaScript code execution
- Session management with shareable links

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional):
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3001

## Build

To build for production:
```bash
npm run build
```

## Integration Tests

Frontend integration tests use Playwright for browser automation to test the entire user flow.

### Setup

1. Navigate to integration tests directory:
```bash
cd integration-tests
```

2. Install test dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install chromium
```

### Running Tests

```bash
# Run all tests (headless mode)
npm test

# Run tests with visible browser
npm run test:headed

# Run tests with interactive UI mode
npm run test:ui

# Debug tests
npm run test:debug
```

### Test Coverage

- Session creation and navigation
- Code editor functionality
- Real-time collaboration between multiple users
- Language switching
- User presence tracking

See `integration-tests/README.md` for detailed documentation.

## Technologies

- React 18
- Vite
- Monaco Editor
- Socket.IO Client
- React Router
- Axios

## Project Structure

```
src/
├── components/
│   ├── AdminPanel.jsx       # Session creation interface
│   └── InterviewSession.jsx # Main interview interface with editor
├── api/
│   └── mockApi.js          # Mock backend API calls
├── services/
│   └── socket.js           # WebSocket connection management
├── App.jsx                 # Main app component with routing
└── main.jsx               # Entry point
```

## Usage

1. Open the app and create a new session
2. Share the generated link with interview candidates
3. Multiple users can join and collaborate in real-time
4. Select programming language from dropdown
5. Write code with syntax highlighting
6. Run JavaScript code directly in the browser