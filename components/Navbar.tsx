import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold text-indigo-600">Acme Feedback Portal</Link>
            <Link href="/feedback" className="text-gray-700 hover:text-indigo-600">Feedback</Link>
            <Link href="/files" className="text-gray-700 hover:text-indigo-600">Files</Link>
            <Link href="/diagnostics" className="text-gray-700 hover:text-indigo-600">Diagnostics</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

