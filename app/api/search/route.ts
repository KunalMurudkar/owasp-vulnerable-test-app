import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

/**
 * VULNERABLE SEARCH API
 * 
 * ⚠️ VULNERABILITY: SQL Injection - OWASP A03
 * 
 * This endpoint performs search using string concatenation:
 * - No prepared statements
 * - Direct user input in SQL query
 * - Allows SQL injection attacks
 * 
 * Scanner should detect: sql
 * 
 * Example attack: ?query=' OR '1'='1' --
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // ⚠️ VULNERABILITY: SQL Injection - String concatenation
    // Allows injection like: ' OR '1'='1' --
    const sqlQuery = `SELECT * FROM feedback WHERE message LIKE '%${query}%' OR name LIKE '%${query}%'`
    
    const results = db.prepare(sqlQuery).all()

    return NextResponse.json({ results })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Search failed: ' + error.message },
      { status: 500 }
    )
  }
}

