# Vulnerable Web Application - Security Testing Lab

⚠️ **WARNING: This application is INTENTIONALLY VULNERABLE**

This is a deliberately insecure web application designed **ONLY** for educational security testing purposes. It contains multiple OWASP Top 10 vulnerabilities and should **NEVER** be deployed in a production environment or exposed to the public internet.

## Purpose

This application serves as a security testing target for automated vulnerability scanners like Wapiti. It is designed to be:

- **Small and fast to scan** - Minimal dependencies and simple structure
- **Realistic** - Looks like a legitimate small SaaS/startup website
- **Clearly documented** - Each vulnerability is marked and explained
- **Easy to deploy** - Vercel-compatible Next.js application (pure JavaScript, no native dependencies)
- **Easy to understand** - Clean code structure with inline comments

## Deployment

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel

# Or connect your GitHub repository to Vercel for automatic deployments
```

## Application Structure

```
├── app/
│   ├── api/              # API routes (vulnerable endpoints)
│   │   ├── login/        # SQL Injection + Brute-force
│   │   ├── feedback/     # XSS + CSRF
│   │   ├── files/        # File Inclusion
│   │   ├── diagnostics/  # Command Injection
│   │   ├── admin/        # Hidden Paths + CSRF
│   │   └── search/       # SQL Injection
│   ├── login/            # Login page
│   ├── feedback/         # Feedback form (XSS)
│   ├── files/            # File viewer (LFI)
│   ├── diagnostics/     # Diagnostics page (Command Injection)
│   └── admin/            # Admin panel (Hidden Paths)
├── lib/
│   ├── db.ts            # Database wrapper (in-memory, vulnerable queries)
│   └── fakeDb.ts        # In-memory database simulation (pure JavaScript)
├── public/              # Static files (including backup files)
```

## Implemented Vulnerabilities

This application implements **all 10 OWASP Top 10 vulnerability categories**:

### 1. Cross-Site Scripting (XSS) - OWASP A03

**Location:** `/feedback` page and `/api/feedback` endpoint

**Vulnerability:**
- User input is stored and displayed without sanitization
- Uses `dangerouslySetInnerHTML` to render user content directly
- No input validation or encoding

**Test Cases:**
- Submit feedback with: `<script>alert('XSS')</script>`
- Submit feedback with: `<img src=x onerror=alert('XSS')>`

**Scanner Detection:** `xss`

---

### 2. SQL Injection - OWASP A03

**Locations:**
- `/api/login` - Login authentication
- `/api/search` - Search functionality
- `/api/feedback` - Feedback storage
- `/api/admin/settings` - Settings update

**Vulnerability:**
- SQL queries built using string concatenation
- No prepared statements
- Direct user input in SQL queries

**Test Cases:**
- Login with: `admin' OR '1'='1' --`
- Search with: `' OR '1'='1' --`
- Search with: `'; DROP TABLE users; --`

**Scanner Detection:** `sql`

---

### 3. Cross-Site Request Forgery (CSRF) - OWASP A01

**Locations:**
- `/api/feedback` - POST endpoint
- `/api/admin/settings` - POST endpoint

**Vulnerability:**
- No CSRF token validation
- Accepts POST requests without origin/referrer checks
- State-changing operations vulnerable to CSRF attacks

**Test Cases:**
- Create a malicious HTML page that submits a form to `/api/feedback`
- Use browser extension or external site to trigger POST requests

**Scanner Detection:** `csrf`

---

### 4. Local File Inclusion (LFI) / Path Traversal - OWASP A05

**Location:** `/api/files/view` endpoint

**Vulnerability:**
- Reads files directly from filesystem based on user input
- No path validation or sanitization
- Allows directory traversal attacks (`../`)

**Test Cases:**
- Request: `/api/files/view?file=../../package.json`
- Request: `/api/files/view?file=../../etc/passwd` (on Linux)
- Request: `/api/files/view?file=../../.env`

**Scanner Detection:** `file`

---

### 5. Command Injection - OWASP A03

**Location:** `/api/diagnostics/ping` endpoint

**Vulnerability:**
- User input passed directly to `exec()` function
- No input sanitization or validation
- Allows command chaining (`;`, `&&`, `||`, `|`)

**Test Cases:**
- Request: `/api/diagnostics/ping?host=127.0.0.1; ls`
- Request: `/api/diagnostics/ping?host=127.0.0.1 && whoami`
- Request: `/api/diagnostics/ping?host=127.0.0.1 | cat /etc/passwd`

**Scanner Detection:** `exec`

---

### 6. Brute-Force Login - OWASP A07

**Location:** `/login` page and `/api/login` endpoint

**Vulnerability:**
- No rate limiting
- No account lockout mechanism
- No CAPTCHA
- Different error messages for invalid user vs invalid password (information disclosure)
- Hardcoded credentials stored in plaintext

**Test Cases:**
- Attempt multiple login attempts with different passwords
- Use automated tools to brute-force credentials
- Test with: `admin` / `admin123` (default credentials)

**Scanner Detection:** `brute_login_form`

---

### 7. Backup Files Exposure - OWASP A05

**Location:** `/public/` directory

**Vulnerable Files:**
- `/backup.zip` - Fake backup archive
- `/db.sqlite.bak` - Database backup file
- `/config.old` - Old configuration file

**Vulnerability:**
- Sensitive backup files publicly accessible
- No access restrictions
- Files contain sensitive information (API keys, passwords, etc.)

**Test Cases:**
- Access: `https://your-domain.com/backup.zip`
- Access: `https://your-domain.com/db.sqlite.bak`
- Access: `https://your-domain.com/config.old`

**Scanner Detection:** `backup`

---

### 8. Hidden Paths / Forced Browsing - OWASP A05

**Locations:**
- `/admin` - Admin panel (not linked in navigation)
- `/api/admin/*` - Admin API endpoints

**Vulnerability:**
- Admin panel not linked from main navigation
- No authentication checks
- Accessible to anyone who knows the URL
- Contains sensitive information (user passwords, settings)

**Test Cases:**
- Access: `https://your-domain.com/admin`
- Access: `https://your-domain.com/api/admin/users`
- Use directory brute-forcing tools to discover hidden paths

**Scanner Detection:** `buster`

---

### 9. Broken Access Control - OWASP A01

**Locations:**
- `/api/admin/delete` - Delete endpoint (no authorization)
- `/api/internal/config` - Internal config endpoint (no authentication)
- `/admin` - Admin panel (no access control)

**Vulnerability:**
- Sensitive endpoints have no authentication checks
- No authorization or role validation
- No session state validation
- Accessible directly via URL to anyone
- Admin operations can be performed by unauthenticated users

**Test Cases:**
- Access: `POST /api/admin/delete` with `{type: 'user', id: 1}`
- Access: `GET /api/internal/config` (exposes sensitive config)
- Access: `/admin` without authentication
- Perform admin operations without being logged in

**Scanner Detection:** `broken_access_control`

---

### 10. Security Logging & Monitoring Failures - OWASP A09

**Locations:**
- `/logs` - Fake logs page (no real logging)
- All API endpoints - No logging implemented

**Vulnerability:**
- No logging of critical security events:
  - Login attempts (successful or failed)
  - Command execution
  - File access
  - Admin operations
  - Delete operations
  - Configuration changes
- No audit trail
- No security alerts
- No monitoring of suspicious activity
- Fake logs page shows empty/outdated information

**Test Cases:**
- Attempt multiple failed logins - check `/logs` (nothing logged)
- Execute commands via diagnostics - check `/logs` (nothing logged)
- Access sensitive files - check `/logs` (nothing logged)
- Perform admin operations - check `/logs` (nothing logged)
- Access: `/logs` to see empty/fake logs

**Scanner Detection:** `security_logging`

---

## Default Credentials

⚠️ **These are intentionally weak credentials for testing:**

- **Username:** `admin` | **Password:** `admin123`
- **Username:** `user` | **Password:** `password`

## Testing with Wapiti

Example Wapiti scan command:

```bash
wapiti -u http://localhost:3000 -m xss,sql,csrf,file,exec,brute_login_form,backup,buster,broken_access_control,security_logging -f json -o wapiti_report.json
```

## Security Best Practices (NOT Implemented)

This application intentionally **does NOT** implement:

- ❌ Input validation and sanitization
- ❌ Prepared statements / parameterized queries
- ❌ CSRF tokens
- ❌ Rate limiting
- ❌ Authentication and authorization
- ❌ Password hashing
- ❌ Content Security Policy (CSP)
- ❌ Security headers
- ❌ Path validation
- ❌ Command input sanitization
- ❌ File access restrictions
- ❌ Error message sanitization
- ❌ Security logging and monitoring
- ❌ Access control and authorization

## Legal and Ethical Notice

This application is provided for **educational and authorized security testing purposes only**. 

- ✅ Use only on systems you own or have explicit permission to test
- ✅ Use only in isolated lab environments
- ❌ Do NOT deploy to production
- ❌ Do NOT expose to the public internet
- ❌ Do NOT use for unauthorized testing

The authors are not responsible for any misuse of this software.

## License

This project is provided as-is for educational purposes. Use at your own risk.

## Contributing

This is an educational project. If you find additional vulnerabilities or want to improve documentation, feel free to submit issues or pull requests.

---

**Remember: This application is INTENTIONALLY VULNERABLE. Never use it in production!**

