<?php
/**
 * Student Attendance System - Configuration
 * Supports PostgreSQL, MySQL, and SQLite drivers.
 *
 * ACTIVE:   PostgreSQL (Supabase) — local development
 * SWITCH:   Uncomment MySQL block below before deploying to Hostinger
 */

return [
    // ---------------------------------------------------------------
    // ACTIVE: MySQL (XAMPP local) — for local development
    // ---------------------------------------------------------------
    'driver'   => 'mysql',
    'host'     => '127.0.0.1',
    'port'     => 3306,
    'dbname'   => 'student_attendance',
    'username' => 'root',
    'password' => '', // XAMPP default: no password

    // ---------------------------------------------------------------
    // HOSTINGER: MySQL — uncomment before uploading to Hostinger
    // ---------------------------------------------------------------
    // 'driver'   => 'mysql',
    // 'host'     => 'localhost',
    // 'port'     => 3306,
    // 'dbname'   => 'u123456789_attendance',
    // 'username' => 'u123456789_admin',
    // 'password' => 'YourHostingerDbPassword',

    // ---------------------------------------------------------------
    // SUPABASE: PostgreSQL — uncomment to switch to cloud DB
    // ---------------------------------------------------------------
    // 'driver'   => 'pgsql',
    'sqlite_path' => __DIR__ . '/attendance.db',

    // ---------------------------------------------------------------
    // JWT Authentication Settings
    // ---------------------------------------------------------------
    'jwt' => [
        'key'        => 'A_Very_Secret_Key_That_Is_Long_Enough_To_Be_Secure_1234567890',
        'issuer'     => 'AttendanceSystem',
        'audience'   => 'AttendanceSystemUsers',
        'expiration' => 7 * 24 * 60 * 60 // 7 days in seconds
    ]
];
