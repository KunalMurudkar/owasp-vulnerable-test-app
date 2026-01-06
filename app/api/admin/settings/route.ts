import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

/**
 * VULNERABLE ADMIN API - Settings
 * 
 * ⚠️ VULNERABILITY 1: Hidden Paths / Forced Browsing - OWASP A05
 * - No authentication checks
 * - Accessible to anyone
 * 
 * ⚠️ VULNERABILITY 2: CSRF - OWASP A01
 * - No CSRF token validation
 * - Accepts POST requests without origin checks
 * 
 * ⚠️ VULNERABILITY 3: SQL Injection - OWASP A03
 * - Uses string concatenation for SQL queries
 * 
 * Scanner should detect: buster, csrf, sql
 */

export async function GET() {
  try {
    // ⚠️ VULNERABILITY: No authentication
    const settings = db.prepare('SELECT * FROM settings').all()
    
    return NextResponse.json({ settings })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // ⚠️ VULNERABILITY: CSRF - No token validation
    const { key, value } = await request.json()

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      )
    }

    // ⚠️ VULNERABILITY: SQL Injection - String concatenation
    const query = `INSERT OR REPLACE INTO settings (key, value) VALUES ('${key}', '${value}')`
    db.exec(query)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update setting: ' + error.message },
      { status: 500 }
    )
  }
}

