import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Acme Feedback Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
              <Link href="/feedback" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Submit Feedback
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Acme Feedback Portal
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your thoughts, report issues, and help us improve our services.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Submit Feedback</h3>
            <p className="text-gray-600 mb-4">Tell us what you think about our platform.</p>
            <Link href="/feedback" className="text-indigo-600 hover:underline">Get Started →</Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">View Files</h3>
            <p className="text-gray-600 mb-4">Access shared documents and resources.</p>
            <Link href="/files" className="text-indigo-600 hover:underline">Browse Files →</Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">System Diagnostics</h3>
            <p className="text-gray-600 mb-4">Check system status and connectivity.</p>
            <Link href="/diagnostics" className="text-indigo-600 hover:underline">View Status →</Link>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-700">
            <strong>⚠️ Security Notice:</strong> This is a deliberately vulnerable application for security testing purposes only.
            Do not use real credentials or sensitive information.
          </p>
        </div>
      </main>
    </div>
  )
}

