import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

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