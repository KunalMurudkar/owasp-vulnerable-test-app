import { NextResponse } from 'next/server'
import db from '@/lib/db'

/**
 * VULNERABLE ADMIN API - Users
 * 
 * ⚠️ VULNERABILITY: Hidden Paths / Forced Browsing - OWASP A05
 * 
 * This endpoint:
 * - No authentication checks
 * - Returns sensitive user data including passwords
 * - Accessible to anyone who knows the URL
 * 
 * Scanner should detect: buster
 */

export async function GET() {
  try {
    // ⚠️ VULNERABILITY: No authentication - anyone can access
    // Returns all users including passwords in plaintext
    const users = db.prepare('SELECT * FROM users').all()
    
    return NextResponse.json({ users })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

