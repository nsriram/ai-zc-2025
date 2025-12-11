# Frontend Integration Tests

This directory contains frontend integration tests with browser automation using Playwright. These tests simulate real user interactions to validate the end-to-end functionality of the coding interview platform.

## Test Structure

- `tests/session-creation.spec.js` - Tests for creating and managing interview sessions
- `tests/code-editing.spec.js` - Tests for code editor functionality
- `tests/realtime-collaboration.spec.js` - Tests for multi-user real-time collaboration

## Prerequisites

Make sure both frontend and backend dependencies are installed:

```bash
cd ../
npm install

cd ../backend
npm install
```

## Installation

Install test dependencies and browsers:

```bash
cd integration-tests
npm install
npx playwright install chromium
```

## Running Tests

### Run all tests (headless mode)
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests with UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### View test report
```bash
npm run report
```

## Test Coverage

### Session Creation Tests (`session-creation.spec.js`)

- **Admin Panel Display**
  - Verify all UI elements are visible
  - Check form fields and buttons

- **Session Creation**
  - Create new sessions with valid data
  - Navigate to session page after creation
  - Validate empty form submissions
  - Create sessions with different programming languages

- **Clipboard Functionality**
  - Verify session link is copied to clipboard

### Code Editing Tests (`code-editing.spec.js`)

- **Editor Display**
  - Monaco editor loads correctly
  - Default code templates display

- **Code Editing**
  - Type and edit code in the editor
  - Code persists across page reloads

- **Language Switching**
  - Change programming language
  - Verify correct template loads

- **Code Execution**
  - Run button availability (for JavaScript)

### Real-time Collaboration Tests (`realtime-collaboration.spec.js`)

- **Code Synchronization**
  - Multiple users can edit simultaneously
  - Changes sync between users in real-time
  - Verify bidirectional sync

- **User Presence**
  - User count updates when users join
  - User count updates when users disconnect

- **Language Synchronization**
  - Language changes sync between all users
  - Code templates update for all users

## How Tests Work

1. **Automatic Server Management**: Tests automatically start both backend and frontend servers
2. **Browser Automation**: Playwright controls real Chromium browser instances
3. **Multiple Users**: Tests can simulate multiple users with separate browser contexts
4. **Real Interactions**: Tests click, type, and interact with the UI like real users

## Notes

- Tests automatically start backend (port 5000) and frontend (port 3000) servers
- Each test runs in a fresh browser context
- Screenshots are captured on test failures
- Tests run serially to avoid port conflicts
- Frontend must be built with Vite in dev mode

## Troubleshooting

If tests fail:

1. **Port conflicts**: Make sure ports 3000 and 5000 are available
2. **Browser not installed**: Run `npx playwright install chromium`
3. **Dependencies**: Ensure both frontend and backend dependencies are installed
4. **Timeout issues**: Check if backend/frontend start successfully
5. **Network issues**: Verify WebSocket connections work on localhost

## CI/CD Integration

Tests can be run in CI environments. Set `CI=true` environment variable:

```bash
CI=true npm test
```

This will:
- Enable test retries (2 retries on failure)
- Prevent reusing existing servers
- Run in fully headless mode

## Performance

- Tests typically take 2-5 minutes to complete
- Each test suite runs independently
- Browser contexts are reused where possible
- Servers remain running across tests