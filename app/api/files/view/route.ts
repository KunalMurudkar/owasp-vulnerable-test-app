import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

/**
 * VULNERABLE FILE VIEWER API
 * 
 * ⚠️ VULNERABILITY 1: Local File Inclusion (LFI) / Path Traversal - OWASP A05
 * 
 * This endpoint reads files directly from the filesystem:
 * - No path validation or sanitization
 * - Allows directory traversal attacks (../)
 * - No whitelist of allowed files
 * - Direct file system access based on user input
 * 
 * ⚠️ VULNERABILITY 2: Security Logging & Monitoring Failures - OWASP A09
 * - No logging of file access
 * - No logging of path traversal attempts
 * - No alerts for suspicious file access
 * - No audit trail
 * 
 * Scanner should detect: file, security_logging
 * 
 * Example attack: ?file=../../etc/passwd
 * Example attack: ?file=../../package.json
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filePath = searchParams.get('file')

    if (!filePath) {
      return NextResponse.json(
        { error: 'File parameter is required' },
        { status: 400 }
      )
    }

    // ⚠️ VULNERABILITY: Path Traversal - No sanitization
    // User input is used directly to construct file paths
    // Allows attacks like: ../../etc/passwd, ../../package.json, etc.
    
    // Construct path - intentionally vulnerable
    const basePath = process.cwd()
    const fullPath = join(basePath, 'public', filePath)

    // ⚠️ VULNERABILITY: No path validation
    // Should check if path is within allowed directory, but doesn't
    
    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // ⚠️ VULNERABILITY: Reads any file without restrictions
    const content = readFileSync(fullPath, 'utf-8')

    // ⚠️ VULNERABILITY: Security Logging Failure
    // Should log: file accessed, path, user, IP, timestamp
    // Should alert on path traversal attempts (../)
    // Should alert on access to sensitive files
    // But we log nothing - intentionally insecure

    return NextResponse.json({ content })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to read file: ' + error.message },
      { status: 500 }
    )
  }
}

