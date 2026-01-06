import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

/**
 * VULNERABLE INTERNAL CONFIG API
 * 
 * ⚠️ VULNERABILITY 1: Broken Access Control - OWASP A01
 * - No authentication checks
 * - No authorization checks
 * - Should be internal/admin only but accessible to anyone
 * - Exposes sensitive configuration
 * 
 * ⚠️ VULNERABILITY 2: Hidden Paths / Forced Browsing - OWASP A05
 * - Not linked from navigation
 * - Accessible via direct URL
 * 
 * ⚠️ VULNERABILITY 3: Security Logging & Monitoring Failures - OWASP A09
 * - No logging of access to sensitive endpoints
 * - No monitoring of unauthorized access attempts
 * 
 * Scanner should detect: broken_access_control, buster, security_logging
 */

export async function GET() {
  try {
    // ⚠️ VULNERABILITY: Broken Access Control
    // This endpoint should require admin/internal access
    // But has no authentication or authorization checks
    
    const settings = db.getAllSettings()
    const users = db.getAllUsers()
    
    // ⚠️ VULNERABILITY: Security Logging Failure
    // Should log access to sensitive config endpoint
    // Should alert on unauthorized access
    // But we log nothing - intentionally insecure
    
    return NextResponse.json({
      config: {
        app_name: 'Acme Feedback Portal',
        version: '1.0.0',
        debug_mode: true,
        database_type: 'in-memory',
        settings_count: settings.length,
        users_count: users.length,
        // ⚠️ VULNERABILITY: Exposes sensitive information
        admin_users: users.filter(u => u.username === 'admin').map(u => ({
          username: u.username,
          email: u.email,
        })),
      },
      settings,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch config: ' + error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // ⚠️ VULNERABILITY: Broken Access Control
    // Allows modifying internal config without authentication
    
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

    // ⚠️ VULNERABILITY: Security Logging Failure
    // Should log config changes, who made them, when
    // But we log nothing

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update config: ' + error.message },
      { status: 500 }
    )
  }
}

