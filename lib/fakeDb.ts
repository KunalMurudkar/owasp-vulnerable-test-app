/**
 * VULNERABLE IN-MEMORY DATABASE
 * 
 * ⚠️ INTENTIONALLY INSECURE - DO NOT USE IN PRODUCTION
 * 
 * This is a fake database that simulates SQL behavior using in-memory JavaScript.
 * It intentionally allows SQL Injection patterns to be detected by scanners.
 * 
 * Features:
 * - Stores data in memory (no persistence)
 * - Simulates SQL queries using string matching
 * - Intentionally vulnerable to SQL injection
 * - Returns predictable outputs for automated scanners
 */

interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  created_at: string;
}

interface Feedback {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface Setting {
  id: number;
  key: string;
  value: string;
}

class FakeDatabase {
  private users: User[] = [];
  private feedback: Feedback[] = [];
  private settings: Setting[] = [];
  private userIdCounter = 1;
  private feedbackIdCounter = 1;
  private settingIdCounter = 1;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Initialize with default data
    this.users = [
      {
        id: this.userIdCounter++,
        username: 'admin',
        password: 'admin123',
        email: 'admin@acme.com',
        created_at: new Date().toISOString(),
      },
      {
        id: this.userIdCounter++,
        username: 'user',
        password: 'password',
        email: 'user@acme.com',
        created_at: new Date().toISOString(),
      },
    ];

    this.settings = [
      {
        id: this.settingIdCounter++,
        key: 'app_name',
        value: 'Acme Feedback Portal',
      },
      {
        id: this.settingIdCounter++,
        key: 'debug_mode',
        value: 'true',
      },
    ];
  }

  /**
   * VULNERABLE SQL EXECUTION
   * 
   * ⚠️ VULNERABILITY: SQL Injection - OWASP A03
   * 
   * This method simulates SQL execution by parsing query strings.
   * It intentionally allows SQL injection patterns like:
   * - ' OR '1'='1
   * - UNION SELECT
   * - ; DROP TABLE
   * 
   * No input sanitization or prepared statements are used.
   */
  exec(query: string): void {
    // Simulate SQL execution - intentionally vulnerable
    // This allows SQL injection patterns to work
    if (query.includes('INSERT')) {
      this.handleInsert(query);
    } else if (query.includes('CREATE TABLE')) {
      // Tables are already created, ignore
    }
  }

  /**
   * VULNERABLE QUERY PREPARATION
   * 
   * ⚠️ VULNERABILITY: SQL Injection - OWASP A03
   * 
   * Returns a fake prepared statement that executes queries
   * without any sanitization or parameter binding.
   */
  prepare(query: string): {
    get: () => any;
    all: () => any[];
    run: () => void;
  } {
    return {
      get: () => this.executeQuery(query, 'single'),
      all: () => this.executeQuery(query, 'all'),
      run: () => this.executeQuery(query, 'run'),
    };
  }

  /**
   * VULNERABLE QUERY EXECUTION
   * 
   * ⚠️ VULNERABILITY: SQL Injection - OWASP A03
   * 
   * Parses SQL queries using string matching.
   * Intentionally allows SQL injection patterns.
   */
  private executeQuery(query: string, mode: 'single' | 'all' | 'run'): any {
    const upperQuery = query.toUpperCase();

    // SELECT queries
    if (upperQuery.includes('SELECT')) {
      return this.handleSelect(query, mode);
    }

    // INSERT queries
    if (upperQuery.includes('INSERT')) {
      this.handleInsert(query);
      return mode === 'run' ? undefined : { success: true };
    }

    // UPDATE queries
    if (upperQuery.includes('UPDATE')) {
      this.handleUpdate(query);
      return mode === 'run' ? undefined : { success: true };
    }

    // DELETE queries
    if (upperQuery.includes('DELETE')) {
      this.handleDelete(query);
      return mode === 'run' ? undefined : { success: true };
    }

    return mode === 'all' ? [] : null;
  }

  /**
   * VULNERABLE SELECT HANDLING
   * 
   * ⚠️ VULNERABILITY: SQL Injection - OWASP A03
   * 
   * Parses SELECT queries and intentionally allows injection patterns.
   */
  private handleSelect(query: string, mode: 'single' | 'all' | 'run'): any {
    const upperQuery = query.toUpperCase();

    // Users table
    if (upperQuery.includes('FROM USERS') || upperQuery.includes('FROM users')) {
      let results = [...this.users];

      // ⚠️ VULNERABILITY: SQL Injection - String matching allows injection
      // Pattern: ' OR '1'='1
      if (query.includes("username = '") || query.includes("username='")) {
        const match = query.match(/username\s*=\s*'([^']*)'/i);
        if (match) {
          const username = match[1];
          
          // ⚠️ VULNERABILITY: Allows SQL injection patterns
          if (username.includes("' OR '1'='1") || username.includes("' OR '1'='1' --")) {
            // Return all users (SQL injection successful)
            return mode === 'single' ? results[0] : mode === 'run' ? undefined : results;
          }
          
          // Check password if present
          const passwordMatch = query.match(/password\s*=\s*'([^']*)'/i);
          if (passwordMatch) {
            const password = passwordMatch[1];
            
            // ⚠️ VULNERABILITY: Allows SQL injection in password
            if (password.includes("' OR '1'='1") || password.includes("' OR '1'='1' --")) {
              return mode === 'single' ? results.find(u => u.username === username) || results[0] : mode === 'run' ? undefined : results;
            }
            
            results = results.filter(u => u.username === username && u.password === password);
          } else {
            results = results.filter(u => u.username === username);
          }
        }
      }

      // ⚠️ VULNERABILITY: UNION SELECT injection
      if (upperQuery.includes('UNION SELECT')) {
        // Return admin user (common injection pattern)
        const admin = this.users.find(u => u.username === 'admin');
        return mode === 'single' ? admin : mode === 'run' ? undefined : (admin ? [admin] : []);
      }

      return mode === 'single' ? (results[0] || null) : mode === 'run' ? undefined : results;
    }

    // Feedback table
    if (upperQuery.includes('FROM FEEDBACK') || upperQuery.includes('FROM feedback')) {
      let results = [...this.feedback];

      // Handle WHERE clauses with LIKE
      if (upperQuery.includes('LIKE')) {
        const messageMatch = query.match(/message\s+LIKE\s+'%([^%]*)%'/i);
        const nameMatch = query.match(/name\s+LIKE\s+'%([^%]*)%'/i);
        
        if (messageMatch || nameMatch) {
          const searchTerm = messageMatch?.[1] || nameMatch?.[1] || '';
          
          // ⚠️ VULNERABILITY: SQL Injection in LIKE clause
          if (searchTerm.includes("' OR '1'='1")) {
            return mode === 'single' ? results[0] : mode === 'run' ? undefined : results;
          }
          
          results = results.filter(f => 
            f.message.includes(searchTerm) || f.name.includes(searchTerm)
          );
        }
      }

      // Handle ORDER BY
      if (upperQuery.includes('ORDER BY')) {
        results.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }

      // Handle LIMIT
      const limitMatch = query.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        const limit = parseInt(limitMatch[1]);
        results = results.slice(0, limit);
      }

      return mode === 'single' ? (results[0] || null) : mode === 'run' ? undefined : results;
    }

    // Settings table
    if (upperQuery.includes('FROM SETTINGS') || upperQuery.includes('FROM settings')) {
      return mode === 'single' ? (this.settings[0] || null) : mode === 'run' ? undefined : [...this.settings];
    }

    return mode === 'all' ? [] : mode === 'run' ? undefined : null;
  }

  /**
   * VULNERABLE INSERT HANDLING
   */
  private handleInsert(query: string): void {
    // Insert into feedback
    if (query.includes('INSERT INTO feedback')) {
      const nameMatch = query.match(/name\s*,\s*email\s*,\s*message\)\s*VALUES\s*\('([^']*)',\s*'([^']*)',\s*'([^']*)'\)/i) ||
                        query.match(/name\s*,\s*email\s*,\s*message\)\s*VALUES\s*\('([^']*)',\s*'([^']*)',\s*'([^']*)'\)/i);
      
      if (nameMatch) {
        this.feedback.push({
          id: this.feedbackIdCounter++,
          name: nameMatch[1],
          email: nameMatch[2] || '',
          message: nameMatch[3],
          created_at: new Date().toISOString(),
        });
      }
    }

    // Insert into settings (INSERT OR REPLACE)
    if (query.includes('INSERT OR REPLACE INTO settings') || query.includes('INSERT INTO settings')) {
      const keyMatch = query.match(/key\s*,\s*value\)\s*VALUES\s*\('([^']*)',\s*'([^']*)'\)/i);
      
      if (keyMatch) {
        const existing = this.settings.find(s => s.key === keyMatch[1]);
        if (existing) {
          existing.value = keyMatch[2];
        } else {
          this.settings.push({
            id: this.settingIdCounter++,
            key: keyMatch[1],
            value: keyMatch[2],
          });
        }
      }
    }
  }

  /**
   * VULNERABLE UPDATE HANDLING
   */
  private handleUpdate(query: string): void {
    // Update settings
    if (query.includes('UPDATE settings')) {
      const keyMatch = query.match(/SET\s+value\s*=\s*'([^']*)'\s+WHERE\s+key\s*=\s*'([^']*)'/i);
      if (keyMatch) {
        const setting = this.settings.find(s => s.key === keyMatch[2]);
        if (setting) {
          setting.value = keyMatch[1];
        }
      }
    }
  }

  /**
   * VULNERABLE DELETE HANDLING
   */
  private handleDelete(query: string): void {
    // Delete from feedback
    if (query.includes('DELETE FROM feedback')) {
      const idMatch = query.match(/WHERE\s+id\s*=\s*(\d+)/i);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        this.feedback = this.feedback.filter(f => f.id !== id);
      } else if (query.includes("' OR '1'='1")) {
        // ⚠️ VULNERABILITY: SQL Injection allows deleting all records
        this.feedback = [];
      }
    }

    // Delete from users
    if (query.includes('DELETE FROM users')) {
      const idMatch = query.match(/WHERE\s+id\s*=\s*(\d+)/i);
      if (idMatch) {
        const id = parseInt(idMatch[1]);
        this.users = this.users.filter(u => u.id !== id);
      }
    }
  }

  // Expose data for admin endpoints
  getAllUsers(): User[] {
    return [...this.users];
  }

  getAllFeedback(): Feedback[] {
    return [...this.feedback];
  }

  getAllSettings(): Setting[] {
    return [...this.settings];
  }

  deleteUser(id: number): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  deleteFeedback(id: number): boolean {
    const index = this.feedback.findIndex(f => f.id === id);
    if (index !== -1) {
      this.feedback.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Singleton instance
let dbInstance: FakeDatabase | null = null;

export default function getDatabase(): FakeDatabase {
  if (!dbInstance) {
    dbInstance = new FakeDatabase();
  }
  return dbInstance;
}

// Export for direct use
const db = getDatabase();
export { db };

