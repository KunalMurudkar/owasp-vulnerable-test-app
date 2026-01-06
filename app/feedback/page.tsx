'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'

/**
 * VULNERABLE FEEDBACK PAGE
 * 
 * ⚠️ VULNERABILITY: Cross-Site Scripting (XSS) - OWASP A03
 * 
 * This page displays user-submitted feedback without sanitization:
 * - Uses dangerouslySetInnerHTML to render user input
 * - No input validation or sanitization
 * - Stored XSS: Feedback is saved and displayed to all users
 * - Reflected XSS: Query parameters are rendered directly
 * 
 * Scanner should detect: xss
 */

export default function FeedbackPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [feedback, setFeedback] = useState<any[]>([])
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    loadFeedback()
  }, [])

  const loadFeedback = async () => {
    try {
      const res = await fetch('/api/feedback')
      const data = await res.json()
      setFeedback(data.feedback || [])
    } catch (err) {
      console.error('Failed to load feedback')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(false)

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      if (res.ok) {
        setSubmitted(true)
        setName('')
        setEmail('')
        setMessage('')
        loadFeedback()
      }
    } catch (err) {
      console.error('Failed to submit feedback')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Submit Feedback</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
            >
              Submit Feedback
            </button>
          </form>

          {submitted && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Thank you for your feedback!
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Recent Feedback</h2>
          
          {feedback.length === 0 ? (
            <p className="text-gray-500">No feedback yet.</p>
          ) : (
            <div className="space-y-4">
              {feedback.map((item) => (
                <div key={item.id} className="border-b pb-4">
                  <div className="flex justify-between mb-2">
                    <strong className="text-lg">
                      {/* ⚠️ VULNERABILITY: XSS - Direct rendering without sanitization */}
                      <span dangerouslySetInnerHTML={{ __html: item.name }} />
                    </strong>
                    <span className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  {/* ⚠️ VULNERABILITY: XSS - Message rendered without sanitization */}
                  <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: item.message }} />
                  {item.email && (
                    <p className="text-sm text-gray-500 mt-1">
                      {/* ⚠️ VULNERABILITY: XSS - Email also vulnerable */}
                      <span dangerouslySetInnerHTML={{ __html: item.email }} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

