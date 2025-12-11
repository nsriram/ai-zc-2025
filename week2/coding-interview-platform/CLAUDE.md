# Coding Interview Platform - using Claude CLI

## Folders
- `frontend` : contains the ReactJS application for the frontend
- `docs` : contains the OpenAPI specs for the backend APIs
- `backend` : contains the ExpressJS application for the backend

## Frontend 
The frontend of the coding interview platform will,
- allow candidates to connect using a link shared with them
- when candidates connect to the link, they should see a code editor interface
- multiple users should be able to connect to the same link and edit code in real-time and also see real-time updates
- the code editor should support syntax highlighting for multiple programming languages
- candidates should be able to execute code safely in the browser

### Frontend Components 
- ReactJS application
- Code editor component (e.g. Monaco Editor)
- WebSocket connection to backend for real-time collaboration
- Admin panel to create and manage interview sessions
- Routing to handle different interview sessions based on unique links
- State management to handle code changes and user sessions
- UI components for code  execution results and error handling
- Styling and theming for better user experience

### Integration with Backend
- Mock backend APIs to simulate real backend interactions during frontend development
- Provide configurable API endpoints for connecting to the real backend when it is implemented

## OpenAPI Specs for Backend APIs
Implement the OpenAPI specs for the backend APIs needed by the frontend.
Use spec version 3.0.0.

## Backend
The backend of the coding interview platform will,
- implement APIs as per the OpenAPI specs
- use in memory database to store code changes and user sessions

## Integration Tests
- Write integration tests to validate the interaction between frontend and backend.
- Frontend automation tests should open the browser and simulate user interactions.
- Use the javascript best practices for writing integration tests.
- Folders should be created as `integration-tests` under the backend directory for backend integration tests and in frontend directory for frontend integration tests.
**Note :** These are integration tests, not unit tests. Hence, do not create the `__tests__` folder inside `frontend` or `backend` directories.

## Readme
- Validate the generated README.md file for completeness and accuracy based on the project structure and features.
- Use markdown best practices for formatting the README.md file.
- Ensure the commands mentioned in both frontend and backend sections are accurately reflected in the README.md file.