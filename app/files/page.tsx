'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

/**
 * VULNERABLE FILE VIEWER PAGE
 * 
 * ⚠️ VULNERABILITY: Local File Inclusion (LFI) / Path Traversal - OWASP A05
 * 
 * This page allows viewing files without proper path validation:
 * - Direct file path from user input
 * - No path sanitization
 * - Allows directory traversal (../)
 * - Reads files directly from filesystem
 * 
 * Scanner should detect: file
 */

export default function FilesPage() {
  const [filePath, setFilePath] = useState('')
  const [fileContent, setFileContent] = useState('')
  const [error, setError] = useState('')

  const handleView = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFileContent('')

    try {
      const res = await fetch(`/api/files/view?file=${encodeURIComponent(filePath)}`)
      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setFileContent(data.content)
      }
    } catch (err) {
      setError('Failed to load file')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">File Viewer</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleView}>
            <div className="mb-4">
              <label htmlFor="filePath" className="block text-sm font-medium text-gray-700 mb-2">
                File Path
              </label>
              <input
                type="text"
                id="filePath"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                placeholder="e.g., readme.txt or ../../etc/passwd"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Available files: readme.txt, config.json, data.txt
              </p>
            </div>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
            >
              View File
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {fileContent && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">File Content</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {fileContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

