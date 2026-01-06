/**
 * VULNERABLE INTERNAL PAGE
 * 
 * ⚠️ VULNERABILITY: Hidden Paths / Forced Browsing - OWASP A05
 * 
 * This page is:
 * - Not linked from navigation
 * - No authentication
 * - Contains internal information
 * 
 * Scanner should detect: buster
 */

export default function InternalPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Internal Documentation</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">System Information</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Database: SQLite (data/app.db)</li>
              <li>Framework: Next.js 14</li>
              <li>Environment: Development</li>
              <li>Debug Mode: Enabled</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">API Endpoints</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>/api/login - Authentication</li>
              <li>/api/feedback - User feedback</li>
              <li>/api/files/view - File viewer</li>
              <li>/api/diagnostics/ping - System diagnostics</li>
              <li>/api/admin/* - Admin endpoints</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Default Credentials</h2>
            <div className="bg-gray-100 p-4 rounded">
              <p className="font-mono text-sm">
                admin / admin123<br />
                user / password
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm text-yellow-700">
              <strong>⚠️ Security Notice:</strong> This internal page should not be publicly accessible.
              It demonstrates forced browsing vulnerabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

