The Initial Prompt:
Build a real-time coding interview platform with the following features:

1. Create shareable links for interview sessions
2. Allow multiple users to edit code simultaneously with real-time synchronization
3. Support syntax highlighting for multiple programming languages
4. Execute code safely in the browser
5. Show real-time updates to all connected users

**Technical Requirements:**
- Frontend: ReactJS application in a 'frontend' directory
  - Use Monaco Editor for code editing with syntax highlighting
  - Implement WebSocket connection for real-time collaboration
  - Create an admin panel to generate and manage interview sessions
  - Add routing to handle different sessions via unique links
  - Include code execution capability in the browser
  - Use mock backend APIs initially

- Backend: ExpressJS application in a 'backend' directory
  - Implement WebSocket support for real-time code synchronization
  - Use in-memory storage for sessions and code state
  - Create REST APIs for session management
  - Handle multiple concurrent interview sessions

- Documentation: Create OpenAPI 3.0.0 specs in a 'docs' directory
  - Define all REST API endpoints
  - Include WebSocket event specifications

Please implement the complete solution with all three components: frontend, OpenAPI specs, and backend.

---
📁 Implementation Complete

Frontend (week2/coding-interview-platform/frontend/):
  - ✅ React 18 with Vite
  - ✅ Monaco Editor for code editing
  - ✅ AdminPanel component for creating sessions
  - ✅ InterviewSession component with real-time editing
  - ✅ WebSocket integration via Socket.IO
  - ✅ Mock API layer
  - ✅ Support for 6 languages (JavaScript, Python, Java, C++, Go, TypeScript)
  - ✅ In-browser JavaScript execution
  - ✅ Modern UI with CSS styling

OpenAPI Specs (week2/coding-interview-platform/docs/):
  - ✅ Complete OpenAPI 3.0.0 specification
  - ✅ REST API endpoints documented
  - ✅ WebSocket events documented
  - ✅ Request/response schemas defined

Backend (week2/coding-interview-platform/backend/):
  - ✅ Express.js server
  - ✅ Socket.IO WebSocket server
  - ✅ REST API endpoints matching OpenAPI spec
  - ✅ In-memory session storage (Map)
  - ✅ User presence tracking
  - ✅ Real-time code synchronization
  - ✅ CORS enabled

**🚀 Getting Started**

# Start Backend
```
cd week2/coding-interview-platform/backend
npm install
npm start
```

# Start Frontend (in new terminal)
```
cd week2/coding-interview-platform/frontend
npm install
npm run dev
```

Visit http://localhost:3000 to use the platform!

# 📊 Project Structure
```
  week2/coding-interview-platform/
  ├── frontend/           (React app)
  │   ├── src/
  │   │   ├── components/
  │   │   ├── api/
  │   │   └── services/
  │   └── package.json
  ├── backend/           (Express server)
  │   ├── server.js
  │   └── package.json
  ├── docs/              (API docs)
  │   └── openapi.yaml
  └── README.md
```
All components are fully functional and ready to use!

