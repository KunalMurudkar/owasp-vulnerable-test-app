'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'

/**
 * VULNERABLE ADMIN PANEL
 * 
 * ⚠️ VULNERABILITY 1: Broken Access Control - OWASP A01
 * - No authentication checks
 * - No authorization checks
 * - No role validation
 * - Accessible to anyone
 * 
 * ⚠️ VULNERABILITY 2: Hidden Paths / Forced Browsing - OWASP A05
 * - Not linked from main navigation (hidden path)
 * - Accessible to anyone who knows the URL
 * - Contains sensitive information
 * 
 * Scanner should detect: broken_access_control, buster
 */

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [settings, setSettings] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersRes, settingsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/settings'),
      ])

      const usersData = await usersRes.json()
      const settingsData = await settingsRes.json()

      setUsers(usersData.users || [])
      setSettings(settingsData.settings || [])
    } catch (err) {
      console.error('Failed to load admin data')
    }
  }

  const handleUpdateSetting = async (key: string, value: string) => {
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      loadData()
    } catch (err) {
      console.error('Failed to update setting')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Users</h2>
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="border-b pb-2">
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Password:</strong> {user.password}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(user.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <div className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.id} className="border-b pb-2">
                  <p><strong>{setting.key}:</strong> {setting.value}</p>
                  <input
                    type="text"
                    defaultValue={setting.value}
                    onBlur={(e) => handleUpdateSetting(setting.key, e.target.value)}
                    className="mt-2 w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-700">
            <strong>⚠️ Security Notice:</strong> This admin panel has no authentication.
            It is intentionally accessible to demonstrate forced browsing vulnerabilities.
          </p>
        </div>
      </div>
    </div>
  )
}

