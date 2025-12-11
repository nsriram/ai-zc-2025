# API Documentation

This directory contains the OpenAPI specifications for the Coding Interview Platform backend APIs.

## Files

- `openapi.yaml` - Complete API specification in OpenAPI 3.0.0 format

## API Overview

### REST Endpoints

1. **POST /api/sessions** - Create a new interview session
2. **GET /api/sessions/:sessionId** - Get session details
3. **PATCH /api/sessions/:sessionId** - Update session code
4. **GET /api/sessions/:sessionId/users** - Get active users

### WebSocket Events

#### Client to Server:
- `join-session` - Join a session
- `code-change` - Send code updates
- `language-change` - Change programming language

#### Server to Client:
- `code-update` - Receive code updates
- `users-update` - Receive user list updates
- `language-change` - Receive language changes
- `error` - Receive error notifications

## Viewing the Specification

You can view and test the API using:

1. **Swagger UI**: Upload the `openapi.yaml` file to [Swagger Editor](https://editor.swagger.io/)
2. **Redoc**: Use [Redoc](https://github.com/Redocly/redoc) for documentation
3. **VS Code**: Install OpenAPI extension for inline viewing

## Base URL

Development: `http://localhost:5000/api`

## Authentication

Currently, no authentication is required. In production, implement JWT or session-based authentication.