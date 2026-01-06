'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

/**
 * VULNERABLE DIAGNOSTICS PAGE
 * 
 * ⚠️ VULNERABILITY: Command Injection - OWASP A03
 * 
 * This page executes system commands based on user input:
 * - Direct command execution without sanitization
 * - No input validation
 * - Allows command chaining (; && ||)
 * - Executes arbitrary shell commands
 * 
 * Scanner should detect: exec
 */

export default function DiagnosticsPage() {
  const [host, setHost] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePing = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult('')

    try {
      const res = await fetch(`/api/diagnostics/ping?host=${encodeURIComponent(host)}`)
      const data = await res.json()

      if (data.error) {
        setResult(`Error: ${data.error}`)
      } else {
        setResult(data.output)
      }
    } catch (err) {
      setResult('Failed to execute ping command')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">System Diagnostics</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handlePing}>
            <div className="mb-4">
              <label htmlFor="host" className="block text-sm font-medium text-gray-700 mb-2">
                Host to Ping
              </label>
              <input
                type="text"
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="e.g., google.com or 127.0.0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Enter a hostname or IP address to test connectivity
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Pinging...' : 'Ping Host'}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Command Output</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

