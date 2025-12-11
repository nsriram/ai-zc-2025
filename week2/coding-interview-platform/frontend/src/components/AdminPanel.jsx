import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSession } from '../api/mockApi'
import './AdminPanel.css'

function AdminPanel() {
  const [sessionName, setSessionName] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleCreateSession = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const session = await createSession({ name: sessionName, language })
      const sessionUrl = `${window.location.origin}/session/${session.id}`

      navigator.clipboard.writeText(sessionUrl)
      alert(`Session created! Link copied to clipboard:\n${sessionUrl}`)
      navigate(`/session/${session.id}`)
    } catch (err) {
      setError('Failed to create session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <h1>Coding Interview Platform</h1>
        <p className="subtitle">Create a new interview session</p>

        <form onSubmit={handleCreateSession} className="session-form">
          <div className="form-group">
            <label htmlFor="sessionName">Session Name</label>
            <input
              type="text"
              id="sessionName"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Enter session name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">Programming Language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
              <option value="typescript">TypeScript</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="create-button">
            {loading ? 'Creating...' : 'Create Session'}
          </button>
        </form>

        <div className="info-section">
          <h3>Features:</h3>
          <ul>
            <li>Real-time collaborative code editing</li>
            <li>Syntax highlighting for multiple languages</li>
            <li>In-browser code execution</li>
            <li>Share link with candidates</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
