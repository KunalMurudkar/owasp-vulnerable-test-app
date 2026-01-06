import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

/**
 * VULNERABLE FEEDBACK API
 * 
 * ⚠️ VULNERABILITY 1: Cross-Site Scripting (XSS) - OWASP A03
 * - Stores user input without sanitization
 * - Returns raw HTML in responses
 * - No validation or encoding
 * 
 * ⚠️ VULNERABILITY 2: CSRF - OWASP A01
 * - No CSRF token validation
 * - Accepts POST requests without origin/referrer checks
 * 
 * Scanner should detect: xss, csrf
 */

export async function GET() {
  try {
    // ⚠️ VULNERABILITY: SQL Injection - No prepared statements
    const feedback = db.prepare('SELECT * FROM feedback ORDER BY created_at DESC LIMIT 50').all()
    
    return NextResponse.json({ feedback })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // ⚠️ VULNERABILITY: CSRF - No token validation, no origin check
    // This endpoint accepts POST requests from any origin
    
    const { name, email, message } = await request.json()

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      )
    }

    // ⚠️ VULNERABILITY: SQL Injection + XSS - No sanitization
    // User input is stored directly without any validation or encoding
    const query = `INSERT INTO feedback (name, email, message) VALUES ('${name}', '${email || ''}', '${message}')`
    
    db.exec(query)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to submit feedback: ' + error.message },
      { status: 500 }
    )
  }
}

