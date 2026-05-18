# Student Attendance System - PHP Backend

This directory contains a complete, robust, and high-performance rewrite of the Student Attendance System backend in PHP and standard SQL using the PHP Database Objects (PDO) layer.

It matches the exact REST API structure, token authorization logic, role handling, and camelCase serialization schemas previously implemented in ASP.NET Core (.NET 9), ensuring the React frontend integrates transparently.

---

## Features

1. **Zero-Dependency JWT Auth:** Complete secure token issuance and signature checking in `JwtHelper.php` without bloated composer packages.
2. **Database Agnostic:** Supports switching between **PostgreSQL**, **MySQL**, and local file-based **SQLite** dynamically via `config.php`.
3. **Database Casing Preservation:** Identifiers use standard double-quoting, rendering it fully compatible with existing EF Core databases (including your active Supabase PostgreSQL db!).
4. **Front-Controller Routing:** All endpoints are cleanly routed through `index.php` using fast, native regular expression pattern matching.

---

## Project Structure

- **`config.php`** — Main system configuration (database connection parameters & JWT secret keys).
- **`Database.php`** — Core database wrapper supplying standard `PDO` connections, fully configured with strict exceptions and standard behavior modifiers.
- **`JwtHelper.php`** — Lightweight token utilities (HMAC SHA-256 signatures, base64url, timing attacks defense, and expiration verification).
- **`index.php`** — Front Controller & API router (CORS headers, routing parser, authentication check, transaction controls).
- **`init-db.php`** — Automated schema and tables setup & default admin seeder.
- **`schema.sql`** — Raw database schema definition.

---

## Setup & Running Instructions

### 1. Database Initialization

To auto-generate the database tables and seed the default admin user account, simply run the database initializer script in your terminal:

```powershell
php init-db.php
```

*Note: The script automatically reads your choice of driver in `config.php` and executes the exact SQL dialect matching that database.*

---

### 2. Run the PHP Server

To host the API, run the built-in PHP web server. The built-in PHP server routes all requests through `index.php` when specified as the routing script. 

To run the backend on the **exact port (`5266`)** expected by your React frontend, run:

```powershell
php -S localhost:5266 index.php
```

Alternatively, if you run on a standard port (like `8000`):
```powershell
php -S localhost:8000 index.php
```
You would simply adjust `API_URL` in `frontend/src/services/api.js` to match:
```javascript
const API_URL = 'http://localhost:8000/api';
```

---

### 3. Database Switching / Configuring

Open `config.php` to adjust your active database:

- **PostgreSQL (Default):**
  Set `'driver' => 'pgsql'` and verify the Supabase parameters (`host`, `port`, `dbname`, `username`, `password`) are correct.
- **SQLite:**
  Set `'driver' => 'sqlite'` and adjust `'sqlite_path'` to your desired `.db` file path.
- **MySQL:**
  Set `'driver' => 'mysql'` and fill in the corresponding parameters.

---

## Default Accounts

Once seeded, you can login using the following accounts:

* **Administrator Account:**
  * **Username:** `admin`
  * **Password:** `admin123`
  * **Role:** Admin (Can manage students, teachers, classes, and assign enrollments)
