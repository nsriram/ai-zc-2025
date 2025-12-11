import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminPanel from './components/AdminPanel'
import InterviewSession from './components/InterviewSession'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<AdminPanel />} />
          <Route path="/session/:sessionId" element={<InterviewSession />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App