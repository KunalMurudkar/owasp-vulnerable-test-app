import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

/**
 * VULNERABLE LOGIN API
 * 
 * ⚠️ VULNERABILITY 1: SQL Injection (OWASP A03)
 * - Uses string concatenation to build SQL queries
 * - No prepared statements
 * - Direct user input in SQL query
 * 
 * ⚠️ VULNERABILITY 2: Brute-Force Login (OWASP A07)
 * - No rate limiting
 * - No account lockout
 * - Different error messages for user vs password
 * 
 * ⚠️ VULNERABILITY 3: Security Logging & Monitoring Failures (OWASP A09)
 * - No logging of login attempts (successful or failed)
 * - No logging of brute-force attempts
 * - No alerts for suspicious activity
 * - No audit trail
 * 
 * Scanner should detect: sql, brute_login_form, security_logging
 */

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password required' },
        { status: 400 }
      )
    }

    // ⚠️ VULNERABILITY: SQL Injection - String concatenation, no prepared statements
    // This allows injection like: username = "admin' OR '1'='1" -- 
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
    
    let user
    try {
      user = db.prepare(query).get()
    } catch (err: any) {
      // ⚠️ VULNERABILITY: Error messages leak information
      return NextResponse.json(
        { success: false, error: 'Database error occurred' },
        { status: 500 }
      )
    }

    if (!user) {
      // ⚠️ VULNERABILITY: Check if user exists first (information disclosure)
      const userCheck = db.prepare(`SELECT * FROM users WHERE username = '${username}'`).get()
      
      // ⚠️ VULNERABILITY: Security Logging Failure
      // Should log failed login attempt: username, IP, timestamp, reason
      // But we log nothing - intentionally insecure
      
      if (!userCheck) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 401 }
        )
      } else {
        return NextResponse.json(
          { success: false, error: 'Invalid password' },
          { status: 401 }
        )
      }
    }

    // ⚠️ VULNERABILITY: Security Logging Failure
    // Should log successful login: username, IP, timestamp
    // Should alert on admin login
    // But we log nothing - intentionally insecure

    return NextResponse.json({
      success: true,
      user: { id: (user as any).id, username: (user as any).username, email: (user as any).email }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}

