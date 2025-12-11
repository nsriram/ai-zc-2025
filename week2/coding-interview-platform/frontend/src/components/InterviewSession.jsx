import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { getSession } from '../api/mockApi'
import { connectSocket, disconnectSocket } from '../services/socket'
import './InterviewSession.css'

function InterviewSession() {
  const { sessionId } = useParams()
  const [code, setCode] = useState('// Start coding here...')
  const [language, setLanguage] = useState('javascript')
  const [output, setOutput] = useState('')
  const [users, setUsers] = useState([])
  const [sessionName, setSessionName] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [pyodideLoaded, setPyodideLoaded] = useState(false)
  const socketRef = useRef(null)
  const pyodideRef = useRef(null)

  useEffect(() => {
    loadSession()
    const socket = connectSocket(sessionId)
    socketRef.current = socket

    socket.on('code-update', (data) => {
      setCode(data.code)
    })

    socket.on('users-update', (data) => {
      setUsers(data.users)
    })

    socket.on('language-change', (data) => {
      setLanguage(data.language)
    })

    return () => {
      disconnectSocket()
    }
  }, [sessionId])

  // Load Pyodide for Python execution
  useEffect(() => {
    const loadPyodide = async () => {
      try {
        // Load Pyodide from CDN
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
        script.async = true

        script.onload = async () => {
          try {
            pyodideRef.current = await window.loadPyodide({
              indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
            })
            setPyodideLoaded(true)
            console.log('Pyodide loaded successfully')
          } catch (err) {
            console.error('Failed to initialize Pyodide:', err)
          }
        }

        document.body.appendChild(script)
      } catch (err) {
        console.error('Failed to load Pyodide:', err)
      }
    }

    loadPyodide()
  }, [])

  const loadSession = async () => {
    try {
      const session = await getSession(sessionId)
      setSessionName(session.name)
      setLanguage(session.language)
      setCode(session.code || '// Start coding here...')
    } catch (err) {
      console.error('Failed to load session:', err)
    }
  }

  const handleCodeChange = (value) => {
    setCode(value)
    if (socketRef.current) {
      socketRef.current.emit('code-change', { sessionId, code: value })
    }
  }

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value
    setLanguage(newLanguage)
    if (socketRef.current) {
      socketRef.current.emit('language-change', { sessionId, language: newLanguage })
    }
  }

  const executeCode = async () => {
    setIsExecuting(true)
    setOutput('Executing...')

    try {
      const result = await runCodeInBrowser(code, language)
      setOutput(result)
    } catch (err) {
      setOutput(`Error: ${err.message}`)
    } finally {
      setIsExecuting(false)
    }
  }

  const runCodeInBrowser = async (code, language) => {
    return new Promise(async (resolve) => {
      try {
        if (language === 'javascript') {
          // Execute JavaScript code
          const logs = []
          const originalLog = console.log
          console.log = (...args) => logs.push(args.join(' '))

          try {
            eval(code)
            console.log = originalLog
            resolve(logs.length > 0 ? logs.join('\n') : 'Code executed successfully (no output)')
          } catch (err) {
            console.log = originalLog
            resolve(`Error: ${err.message}`)
          }
        } else if (language === 'python') {
          // Execute Python code using Pyodide
          if (!pyodideLoaded || !pyodideRef.current) {
            resolve('Python runtime is still loading. Please wait a moment and try again.')
            return
          }

          try {
            // Capture stdout
            const output = []
            pyodideRef.current.setStdout({
              batched: (text) => output.push(text)
            })

            // Run the Python code
            await pyodideRef.current.runPythonAsync(code)

            // Return the captured output
            const result = output.join('')
            resolve(result.length > 0 ? result : 'Code executed successfully (no output)')
          } catch (err) {
            resolve(`Python Error: ${err.message}`)
          }
        } else {
          resolve(`Code execution for ${language} is not yet implemented in browser.\nCurrently supported: JavaScript, Python`)
        }
      } catch (err) {
        resolve(`Error: ${err.message}`)
      }
    })
  }

  const copySessionLink = () => {
    const link = window.location.href
    navigator.clipboard.writeText(link)
    alert('Session link copied to clipboard!')
  }

  return (
    <div className="interview-session">
      <header className="session-header">
        <div className="header-left">
          <h2>{sessionName || 'Interview Session'}</h2>
          <span className="session-id">Session ID: {sessionId}</span>
        </div>
        <div className="header-right">
          <div className="users-count">
            <span className="user-icon">👥</span>
            <span>{users.length} user{users.length !== 1 ? 's' : ''}</span>
          </div>
          <button onClick={copySessionLink} className="copy-link-btn">
            Copy Link
          </button>
        </div>
      </header>

      <div className="session-content">
        <div className="editor-section">
          <div className="editor-controls">
            <label>
              Language:
              <select value={language} onChange={handleLanguageChange}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
                <option value="typescript">TypeScript</option>
              </select>
            </label>
            <button
              onClick={executeCode}
              disabled={isExecuting}
              className="run-button"
            >
              {isExecuting ? 'Running...' : '▶ Run Code'}
            </button>
          </div>

          <div className="editor-container">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        <div className="output-section">
          <div className="output-header">
            <h3>Output</h3>
          </div>
          <div className="output-content">
            <pre>{output || 'Run your code to see output here...'}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewSession
