/**
 * VULNERABLE DATABASE SETUP
 * 
 * This database uses SQLite with NO prepared statements.
 * All queries are built using string concatenation, making them
 * vulnerable to SQL Injection attacks.
 * 
 * ⚠️ INTENTIONALLY INSECURE - DO NOT USE IN PRODUCTION
 */

import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Database file path
const dbPath = join(process.cwd(), 'data', 'app.db');
const dbDir = join(process.cwd(), 'data');

// Ensure data directory exists
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new Database(dbPath);

// Create tables with vulnerable schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL
  );
`);

// Insert default vulnerable user (hardcoded credentials)
// ⚠️ VULNERABILITY: Hardcoded credentials, no password hashing
try {
  db.exec(`
    INSERT OR IGNORE INTO users (username, password, email) 
    VALUES ('admin', 'admin123', 'admin@acme.com');
    
    INSERT OR IGNORE INTO users (username, password, email) 
    VALUES ('user', 'password', 'user@acme.com');
  `);
} catch (e) {
  // Ignore if already exists
}

export default db;

