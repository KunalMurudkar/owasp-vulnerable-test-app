/**
 * VULNERABLE LOGS PAGE
 * 
 * ⚠️ VULNERABILITY: Security Logging & Monitoring Failures - OWASP A09
 * 
 * This page demonstrates security logging failures:
 * - Shows fake/empty logs (no real logging implemented)
 * - No audit trail of security events
 * - No monitoring of critical actions
 * - No alerts for suspicious activity
 * 
 * Critical events that should be logged but aren't:
 * - Login attempts (successful and failed)
 * - Command execution
 * - File access
 * - Admin operations
 * - Delete operations
 * - Configuration changes
 * 
 * Scanner should detect: security_logging
 */

export default function LogsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Security Logs</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          
          {/* ⚠️ VULNERABILITY: Security Logging Failure */}
          {/* This page shows fake/empty logs - no real logging is implemented */}
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-gray-500 text-sm">
              No recent activity logged.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Last updated: Never
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Failed Login Attempts</h2>
          
          {/* ⚠️ VULNERABILITY: Security Logging Failure */}
          {/* Should log failed login attempts but doesn't */}
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-gray-500 text-sm">
              No failed login attempts recorded.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Admin Operations</h2>
          
          {/* ⚠️ VULNERABILITY: Security Logging Failure */}
          {/* Should log admin operations but doesn't */}
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-gray-500 text-sm">
              No admin operations logged.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">System Events</h2>
          
          {/* ⚠️ VULNERABILITY: Security Logging Failure */}
          {/* Should log system events but doesn't */}
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-gray-500 text-sm">
              No system events recorded.
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-700">
            <strong>⚠️ Security Notice:</strong> This application does not implement proper security logging and monitoring.
            Critical security events are not logged, monitored, or alerted. This demonstrates OWASP A09 vulnerabilities.
          </p>
        </div>

        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-sm text-red-700">
            <strong>Missing Security Logging:</strong>
          </p>
          <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
            <li>No logging of login attempts (successful or failed)</li>
            <li>No logging of command execution</li>
            <li>No logging of file access</li>
            <li>No logging of admin operations</li>
            <li>No logging of delete operations</li>
            <li>No logging of configuration changes</li>
            <li>No audit trail</li>
            <li>No security alerts</li>
            <li>No monitoring of suspicious activity</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

