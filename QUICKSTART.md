# Quick Start Guide

## Installation

```bash
# Install dependencies
npm install
```

## Running Locally

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Testing Vulnerabilities

### 1. XSS (Cross-Site Scripting)
- Navigate to `/feedback`
- Submit feedback with: `<script>alert('XSS')</script>`
- The script will execute when viewing feedback

### 2. SQL Injection
- Navigate to `/login`
- Try logging in with: `admin' OR '1'='1' --` / `anything`
- Or use the search endpoint: `/api/search?query=' OR '1'='1' --`

### 3. CSRF
- Create an HTML file with a form that POSTs to `/api/feedback`
- Open it in a browser and submit (while logged into the app)

### 4. File Inclusion
- Navigate to `/files`
- Try: `../../package.json` or `../../README.md`

### 5. Command Injection
- Navigate to `/diagnostics`
- Try: `127.0.0.1; ls` or `127.0.0.1 && whoami`

### 6. Brute-Force Login
- Navigate to `/login`
- Try multiple login attempts with different passwords
- Notice different error messages for invalid user vs invalid password

### 7. Backup Files
- Access directly:
  - `/backup.zip`
  - `/db.sqlite.bak`
  - `/config.old`

### 8. Hidden Paths
- Access unlinked pages:
  - `/admin`
  - `/internal`
  - `/debug`

## Default Credentials

- **admin** / **admin123**
- **user** / **password**

## Scanning with Wapiti

```bash
# Install Wapiti
pip install wapiti3

# Run scan
wapiti -u http://localhost:3000 \
  -m xss,sql,csrf,file,exec,brute_login_form,backup,buster \
  -f json -o report.json
```

## Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

**Note:** The SQLite database will be created automatically on first request. For production-like testing, consider using Vercel's file system or an external database service (though this app intentionally avoids external services for simplicity).

