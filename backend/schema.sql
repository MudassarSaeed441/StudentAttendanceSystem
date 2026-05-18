-- ====================================================================
-- STUDENT ATTENDANCE SYSTEM - SQL DATABASE SCHEMA
-- ====================================================================
-- Note: Uses double-quoted identifiers to match EF Core capitalization exactly.
-- This ensures full compatibility with the existing PostgreSQL Supabase DB.

-- --------------------------------------------------------------------
-- POSTGRESQL DIALECT (Default / Supabase)
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "Users" (
    "Id" SERIAL PRIMARY KEY,
    "Username" VARCHAR(100) UNIQUE NOT NULL,
    "PasswordHash" VARCHAR(255) NOT NULL,
    "Role" INT NOT NULL -- 0 = Admin, 1 = Teacher
);

CREATE TABLE IF NOT EXISTS "Students" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(255) NOT NULL,
    "StudentCode" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Teachers" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(255) NOT NULL,
    "UserId" INT NOT NULL REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Classes" (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(255) NOT NULL,
    "ClassCode" VARCHAR(100) UNIQUE NOT NULL,
    "TeacherId" INT NOT NULL REFERENCES "Teachers" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Enrollments" (
    "StudentId" INT NOT NULL REFERENCES "Students" ("Id") ON DELETE CASCADE,
    "ClassId" INT NOT NULL REFERENCES "Classes" ("Id") ON DELETE CASCADE,
    PRIMARY KEY ("StudentId", "ClassId")
);

CREATE TABLE IF NOT EXISTS "Attendances" (
    "Id" SERIAL PRIMARY KEY,
    "StudentId" INT NOT NULL REFERENCES "Students" ("Id") ON DELETE CASCADE,
    "ClassId" INT NOT NULL REFERENCES "Classes" ("Id") ON DELETE CASCADE,
    "Date" TIMESTAMP NOT NULL,
    "IsPresent" BOOLEAN NOT NULL
);


-- --------------------------------------------------------------------
-- MYSQL DIALECT (Alternative)
-- --------------------------------------------------------------------
/*
CREATE TABLE IF NOT EXISTS "Users" (
    "Id" INT AUTO_INCREMENT PRIMARY KEY,
    "Username" VARCHAR(100) UNIQUE NOT NULL,
    "PasswordHash" VARCHAR(255) NOT NULL,
    "Role" INT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Students" (
    "Id" INT AUTO_INCREMENT PRIMARY KEY,
    "Name" VARCHAR(255) NOT NULL,
    "StudentCode" VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Teachers" (
    "Id" INT AUTO_INCREMENT PRIMARY KEY,
    "Name" VARCHAR(255) NOT NULL,
    "UserId" INT NOT NULL,
    FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Classes" (
    "Id" INT AUTO_INCREMENT PRIMARY KEY,
    "Name" VARCHAR(255) NOT NULL,
    "ClassCode" VARCHAR(100) UNIQUE NOT NULL,
    "TeacherId" INT NOT NULL,
    FOREIGN KEY ("TeacherId") REFERENCES "Teachers" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Enrollments" (
    "StudentId" INT NOT NULL,
    "ClassId" INT NOT NULL,
    PRIMARY KEY ("StudentId", "ClassId"),
    FOREIGN KEY ("StudentId") REFERENCES "Students" ("Id") ON DELETE CASCADE,
    FOREIGN KEY ("ClassId") REFERENCES "Classes" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Attendances" (
    "Id" INT AUTO_INCREMENT PRIMARY KEY,
    "StudentId" INT NOT NULL,
    "ClassId" INT NOT NULL,
    "Date" DATETIME NOT NULL,
    "IsPresent" TINYINT(1) NOT NULL,
    FOREIGN KEY ("StudentId") REFERENCES "Students" ("Id") ON DELETE CASCADE,
    FOREIGN KEY ("ClassId") REFERENCES "Classes" ("Id") ON DELETE CASCADE
);
*/


-- --------------------------------------------------------------------
-- SQLITE DIALECT (Alternative / Local file-based)
-- --------------------------------------------------------------------
/*
CREATE TABLE IF NOT EXISTS "Users" (
    "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "Username" TEXT UNIQUE NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Role" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "Students" (
    "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "StudentCode" TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Teachers" (
    "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "UserId" INTEGER NOT NULL,
    FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Classes" (
    "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "Name" TEXT NOT NULL,
    "ClassCode" TEXT UNIQUE NOT NULL,
    "TeacherId" INTEGER NOT NULL,
    FOREIGN KEY ("TeacherId") REFERENCES "Teachers" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Enrollments" (
    "StudentId" INTEGER NOT NULL,
    "ClassId" INTEGER NOT NULL,
    PRIMARY KEY ("StudentId", "ClassId"),
    FOREIGN KEY ("StudentId") REFERENCES "Students" ("Id") ON DELETE CASCADE,
    FOREIGN KEY ("ClassId") REFERENCES "Classes" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Attendances" (
    "Id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "StudentId" INTEGER NOT NULL,
    "ClassId" INTEGER NOT NULL,
    "Date" TEXT NOT NULL,
    "IsPresent" INTEGER NOT NULL,
    FOREIGN KEY ("StudentId") REFERENCES "Students" ("Id") ON DELETE CASCADE,
    FOREIGN KEY ("ClassId") REFERENCES "Classes" ("Id") ON DELETE CASCADE
);
*/
