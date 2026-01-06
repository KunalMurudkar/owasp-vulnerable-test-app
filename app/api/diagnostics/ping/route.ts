import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * VULNERABLE DIAGNOSTICS API
 * 
 * ⚠️ VULNERABILITY 1: Command Injection - OWASP A03
 * 
 * This endpoint executes shell commands directly:
 * - User input passed directly to exec()
 * - No input sanitization or validation
 * - Allows command chaining (; && || |)
 * - No whitelist of allowed commands
 * 
 * ⚠️ VULNERABILITY 2: Security Logging & Monitoring Failures - OWASP A09
 * - No logging of command execution
 * - No logging of command parameters
 * - No alerts for suspicious commands
 * - No audit trail
 * 
 * Scanner should detect: exec, security_logging
 * 
 * Example attacks:
 * - host=127.0.0.1; ls
 * - host=127.0.0.1 && whoami
 * - host=127.0.0.1 | cat /etc/passwd
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const host = searchParams.get('host')

    if (!host) {
      return NextResponse.json(
        { error: 'Host parameter is required' },
        { status: 400 }
      )
    }

    // ⚠️ VULNERABILITY: Command Injection
    // User input is directly concatenated into shell command
    // No sanitization, no validation, no whitelist
    // Allows arbitrary command execution
    
    const command = `ping -c 4 ${host}`
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: 5000,
      })

      // ⚠️ VULNERABILITY: Security Logging Failure
      // Should log: command executed, user, IP, timestamp, output
      // Should alert on suspicious commands (ls, cat, etc.)
      // But we log nothing - intentionally insecure

      return NextResponse.json({
        output: stdout || stderr || 'Command executed successfully',
      })
    } catch (error: any) {
      // ⚠️ VULNERABILITY: Error messages may leak information
      // ⚠️ VULNERABILITY: Security Logging Failure
      // Should log failed command execution attempts
      // But we log nothing
      
      return NextResponse.json({
        output: error.stdout || error.stderr || error.message,
      })
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to execute command: ' + error.message },
      { status: 500 }
    )
  }
}

