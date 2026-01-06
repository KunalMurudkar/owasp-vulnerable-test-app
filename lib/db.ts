/**
 * VULNERABLE DATABASE SETUP
 * 
 * ⚠️ INTENTIONALLY INSECURE - DO NOT USE IN PRODUCTION
 * 
 * This module provides an in-memory database that simulates SQL behavior.
 * All queries are built using string concatenation, making them
 * vulnerable to SQL Injection attacks.
 * 
 * Uses pure JavaScript - no native dependencies for Vercel compatibility.
 */

import { db } from './fakeDb';

export default db;
