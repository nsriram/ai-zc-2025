import { io } from 'socket.io-client'

// Use environment variable in development, or dynamically determine URL in production
const getSocketUrl = () => {
  // If we have an explicit env var set (for development), use it
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL
  }

  // In production, use the same origin as the current page
  // This works because the backend serves both the frontend and handles WebSockets
  if (import.meta.env.PROD) {
    return window.location.origin
  }

  // Fallback for development if no env var is set
  return 'http://localhost:3000'
}

const SOCKET_URL = getSocketUrl()

let socket = null

export function connectSocket(sessionId) {
  if (socket) {
    socket.disconnect()
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
  })

  socket.on('connect', () => {
    console.log('Connected to server')
    socket.emit('join-session', { sessionId })
  })

  socket.on('disconnect', () => {
    console.log('Disconnected from server')
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })

  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function getSocket() {
  return socket
}