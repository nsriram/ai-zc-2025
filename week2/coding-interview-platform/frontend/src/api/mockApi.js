const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const mockSessions = new Map()

function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

export async function createSession(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const session = {
        id: generateId(),
        name: data.name,
        language: data.language,
        code: getDefaultCode(data.language),
        createdAt: new Date().toISOString(),
      }
      mockSessions.set(session.id, session)
      resolve(session)
    }, 300)
  })
}

export async function getSession(sessionId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const session = mockSessions.get(sessionId)
      if (session) {
        resolve(session)
      } else {
        const newSession = {
          id: sessionId,
          name: 'Interview Session',
          language: 'javascript',
          code: getDefaultCode('javascript'),
          createdAt: new Date().toISOString(),
        }
        mockSessions.set(sessionId, newSession)
        resolve(newSession)
      }
    }, 200)
  })
}

export async function updateSessionCode(sessionId, code) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const session = mockSessions.get(sessionId)
      if (session) {
        session.code = code
        mockSessions.set(sessionId, session)
      }
      resolve({ success: true })
    }, 100)
  })
}

function getDefaultCode(language) {
  const templates = {
    javascript: `// JavaScript code
function greet(name) {
  console.log('Hello, ' + name + '!');
}

greet('World');`,
    python: `# Python code
def greet(name):
    print(f'Hello, {name}!')

greet('World')`,
    java: `// Java code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    cpp: `// C++ code
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    go: `// Go code
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
    typescript: `// TypeScript code
function greet(name: string): void {
  console.log(\`Hello, \${name}!\`);
}

greet('World');`,
  }
  return templates[language] || '// Start coding here...'
}