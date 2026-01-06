import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

/**
 * VULNERABLE ADMIN DELETE API
 * 
 * ⚠️ VULNERABILITY 1: Broken Access Control - OWASP A01
 * - No authentication checks
 * - No authorization checks
 * - No role validation
 * - Anyone can delete users or feedback
 * - Accessible directly via URL
 * 
 * ⚠️ VULNERABILITY 2: Hidden Paths / Forced Browsing - OWASP A05
 * - Not linked from navigation
 * - Accessible to anyone who knows the URL
 * 
 * ⚠️ VULNERABILITY 3: Security Logging & Monitoring Failures - OWASP A09
 * - No logging of delete operations
 * - No audit trail
 * - No alerts for suspicious activity
 * 
 * Scanner should detect: broken_access_control, buster, security_logging
 */

export async function POST(request: NextRequest) {
  try {
    // ⚠️ VULNERABILITY: Broken Access Control
    // No authentication - anyone can delete data
    // No authorization - no role checks
    // No session validation
    
    const { type, id } = await request.json()

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      )
    }

    let success = false

    if (type === 'user') {
      // ⚠️ VULNERABILITY: No authorization check - should require admin role
      success = db.deleteUser(parseInt(id))
      
      // ⚠️ VULNERABILITY: Security Logging Failure
      // Should log: who deleted, what was deleted, when, from where
      // But we don't log anything - intentionally insecure
    } else if (type === 'feedback') {
      // ⚠️ VULNERABILITY: No authorization check
      success = db.deleteFeedback(parseInt(id))
      
      // ⚠️ VULNERABILITY: Security Logging Failure
      // Should log deletion but doesn't
    }

    if (success) {
      return NextResponse.json({ success: true, message: `${type} deleted` })
    } else {
      return NextResponse.json(
        { error: 'Failed to delete' },
        { status: 404 }
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Delete failed: ' + error.message },
      { status: 500 }
    )
  }
}

