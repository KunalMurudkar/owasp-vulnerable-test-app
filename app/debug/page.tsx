/**
 * VULNERABLE DEBUG PAGE
 * 
 * ⚠️ VULNERABILITY: Hidden Paths / Forced Browsing - OWASP A05
 * 
 * This debug page is:
 * - Not linked from navigation
 * - No authentication
 * - Contains debug information and error details
 * 
 * Scanner should detect: buster
 */

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Information</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
            <div className="bg-gray-100 p-4 rounded font-mono text-sm">
              <p>Debug Mode: Enabled</p>
              <p>Environment: Development</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">System Status</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Status: Running</li>
              <li>Uptime: Active</li>
              <li>Database: Connected</li>
              <li>File System: Accessible</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Error Logs</h2>
            <div className="bg-red-50 border border-red-200 p-4 rounded">
              <p className="text-sm text-red-700">
                No recent errors detected.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm text-yellow-700">
              <strong>⚠️ Security Notice:</strong> Debug pages should never be exposed in production.
              This page demonstrates forced browsing vulnerabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

