// Use environment variable in development, or dynamically determine URL in production
const getApiBaseUrl = () => {
  // If we have an explicit env var set (for development), use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  // In production, use the same origin as the current page
  if (import.meta.env.PROD) {
    return `${window.location.origin}/api`
  }

  // Fallback for development if no env var is set
  return 'http://localhost:3000/api'
}

const API_BASE_URL = getApiBaseUrl()

export async function createSession(data) {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to create session')
  }

  return response.json()
}

export async function getSession(sessionId) {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch session')
  }

  return response.json()
}

export async function updateSessionCode(sessionId, code) {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  })

  if (!response.ok) {
    throw new Error('Failed to update session')
  }

  return response.json()
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