<?php
/**
 * Student Attendance System - Database Initializer & Seeder
 * Run via terminal: php init-db.php
 * Auto-creates necessary tables and seeds default admin user if not present.
 */

require_once __DIR__ . '/Database.php';

$config = require __DIR__ . '/config.php';
$pdo = Database::getConnection();
$driver = $config['driver'];

echo "======================================================\n";
echo "DATABASE INITIALIZATION: {$driver}\n";
echo "======================================================\n";

try {
    // Generate DDL statements based on the database driver
    if ($driver === 'sqlite') {
        $queries = [
            'CREATE TABLE IF NOT EXISTS "Users" (
                "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
                "Username" TEXT UNIQUE NOT NULL,
                "PasswordHash" TEXT NOT NULL,
                "Role" INTEGER NOT NULL
            );',
            'CREATE TABLE IF NOT EXISTS "Students" (
                "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
                "Name" TEXT NOT NULL,
                "StudentCode" TEXT UNIQUE NOT NULL,
                "FatherName" TEXT DEFAULT \'\'
            );',
            'CREATE TABLE IF NOT EXISTS "Teachers" (
                "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
                "Name" TEXT NOT NULL,
                "UserId" INTEGER NOT NULL,
                FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
            );',
            'CREATE TABLE IF NOT EXISTS "Classes" (
                "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
                "Name" TEXT NOT NULL,
                "ClassCode" TEXT UNIQUE NOT NULL,
                "TeacherId" INTEGER NOT NULL,
                FOREIGN KEY ("TeacherId") REFERENCES "Teachers" ("Id") ON DELETE CASCADE
            );',
            'CREATE TABLE IF NOT EXISTS "Enrollments" (
                "StudentId" INTEGER NOT NULL,
                "ClassId" INTEGER NOT NULL,
                PRIMARY KEY ("StudentId", "ClassId"),
                FOREIGN KEY ("StudentId") REFERENCES "Students" ("Id") ON DELETE CASCADE,
                FOREIGN KEY ("ClassId") REFERENCES "Classes" ("Id") ON DELETE CASCADE
            );',
            'CREATE TABLE IF NOT EXISTS "Attendances" (
                "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
                "StudentId" INTEGER NOT NULL,
                "ClassId" INTEGER NOT NULL,
                "Date" TEXT NOT NULL,
                "IsPresent" INTEGER NOT NULL,
                FOREIGN KEY ("StudentId") REFERENCES "Students" ("Id") ON DELETE CASCADE,
                FOREIGN KEY ("ClassId") REFERENCES "Classes" ("Id") ON DELETE CASCADE
            );'
        ];
    } elseif ($driver === 'pgsql') {
        $queries = [
            'CREATE TABLE IF NOT EXISTS "Users" (
                "Id" SERIAL PRIMARY KEY,
                "Username" VARCHAR(100) UNIQUE NOT NULL,
                "PasswordHash" VARCHAR(255) NOT NULL,
                "Role" INT NOT NULL
            );',
            'CREATE TABLE IF NOT EXISTS "Students" (
                "Id" SERIAL PRIMARY KEY,
                "Name" VARCHAR(255) NOT NULL,
                "StudentCode" VARCHAR(100) UNIQUE NOT NULL,
                "FatherName" VARCHAR(255) DEFAULT \'\'
            );',
            'CREATE TABLE IF NOT EXISTS "Teachers" (
                "Id" SERIAL PRIMARY KEY,
                "Name" VARCHAR(255) NOT NULL,
                "UserId" INT NOT NULL REFERENCES "Users" ("Id") ON DELETE CASCADE
            );',
            'CREATE TABLE IF NOT EXISTS "Classes" (
                "Id" SERIAL PRIMARY KEY,
                "Name" VARCHAR(255) NOT NULL,
                "ClassCode" VARCHAR(100) UNIQUE NOT NULL,
                "TeacherId" INT NOT NULL REFERENCES "Teachers" ("Id") ON DELETE CASCADE
            );',
            'CREATE TABLE IF NOT EXISTS "Enrollments" (
                "StudentId" INT NOT NULL REFERENCES "Students" ("Id") ON DELETE CASCADE,
                "ClassId" INT NOT NULL REFERENCES "Classes" ("Id") ON DELETE CASCADE,
                PRIMARY KEY ("StudentId", "ClassId")
            );',
            'CREATE TABLE IF NOT EXISTS "Attendances" (
                "Id" SERIAL PRIMARY KEY,
                "StudentId" INT NOT NULL REFERENCES "Students" ("Id") ON DELETE CASCADE,
                "ClassId" INT NOT NULL REFERENCES "Classes" ("Id") ON DELETE CASCADE,
                "Date" TIMESTAMP NOT NULL,
                "IsPresent" BOOLEAN NOT NULL
            );'
        ];
    } else { // mysql
        $queries = [
            'CREATE TABLE IF NOT EXISTS "Users" (
                "Id" INT AUTO_INCREMENT PRIMARY KEY,
                "Username" VARCHAR(100) UNIQUE NOT NULL,
                "PasswordHash" VARCHAR(255) NOT NULL,
                "Role" INT NOT NULL
            );',
            'CREATE TABLE IF NOT EXISTS "Students" (
                "Id" INT AUTO_INCREMENT PRIMARY KEY,
                "Name" VARCHAR(255) NOT NULL,
                "StudentCode" VARCHAR(100) UNIQUE NOT NULL,
                "FatherName" VARCHAR(255) DEFAULT \'\'
            );',
            'CREATE TABLE IF NOT EXISTS "Teachers" (
                "Id" INT AUTO_INCREMENT PRIMARY KEY,
                "Name" VARCHAR(255) NOT NULL,
                "UserId" INT NOT NULL,
                FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
            );',
            'CREATE TABLE IF NOT EXISTS "Classes" (
                "Id" INT AUTO_INCREMENT PRIMARY KEY,
                "Name" VARCHAR(255) NOT NULL,
                "ClassCode" VARCHAR(100) UNIQUE NOT NULL,
                "TeacherId" INT NOT NULL,
                FOREIGN KEY ("TeacherId") REFERENCES "Teachers" ("Id") ON DELETE CASCADE
            );',
            'CREATE TABLE IF NOT EXISTS "Enrollments" (
                "StudentId" INT NOT NULL,
                "ClassId" INT NOT NULL,
                PRIMARY KEY ("StudentId", "ClassId"),
                FOREIGN KEY ("StudentId") REFERENCES "Students" ("Id") ON DELETE CASCADE,
                FOREIGN KEY ("ClassId") REFERENCES "Classes" ("Id") ON DELETE CASCADE
            );',
            'CREATE TABLE IF NOT EXISTS "Attendances" (
                "Id" INT AUTO_INCREMENT PRIMARY KEY,
                "StudentId" INT NOT NULL,
                "ClassId" INT NOT NULL,
                "Date" DATETIME NOT NULL,
                "IsPresent" TINYINT(1) NOT NULL,
                FOREIGN KEY ("StudentId") REFERENCES "Students" ("Id") ON DELETE CASCADE,
                FOREIGN KEY ("ClassId") REFERENCES "Classes" ("Id") ON DELETE CASCADE
            );'
        ];
    }

    // Execute queries to build the schema
    foreach ($queries as $query) {
        $pdo->exec($query);
    }
    echo "[INFO] Tables created successfully or already exist.\n";

    // Seed default Admin user if they do not exist
    // Checking role = 0 (Admin) or username = 'admin'
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM "Users" WHERE "Username" = ? OR "Role" = 0');
    $stmt->execute(['admin']);
    $adminExists = (int)$stmt->fetchColumn() > 0;

    if (!$adminExists) {
        $username = 'admin';
        $passwordHash = password_hash('Yousaf@4321@1', PASSWORD_BCRYPT);
        $role = 0; // Admin Role

        $stmt = $pdo->prepare('INSERT INTO "Users" ("Username", "PasswordHash", "Role") VALUES (?, ?, ?)');
        $stmt->execute([$username, $passwordHash, $role]);
        echo "[INFO] Seeded default Admin user: username = 'admin', password = 'Yousaf@4321@1'\n";
    } else {
        echo "[INFO] Admin user already exists. Skipping database seeding.\n";
    }

    echo "======================================================\n";
    echo "SUCCESS: Database initialized successfully!\n";
    echo "======================================================\n";

} catch (Exception $e) {
    echo "======================================================\n";
    echo "ERROR during database initialization:\n";
    echo $e->getMessage() . "\n";
    echo "======================================================\n";
    exit(1);
}
