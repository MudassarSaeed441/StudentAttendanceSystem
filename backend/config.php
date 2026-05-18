<?php
/**
 * Student Attendance System - Configuration
 * Supports PostgreSQL, MySQL, and SQLite drivers.
 *
 * ACTIVE:   MySQL (Hostinger)
 * FALLBACK: PostgreSQL (Supabase) — commented out below
 */

return [
    // ---------------------------------------------------------------
    // ACTIVE: MySQL for Hostinger
    // Replace the values below with your Hostinger hPanel DB credentials
    // ---------------------------------------------------------------
    'driver'   => 'mysql',
    'host'     => 'localhost',        // Hostinger DB host (almost always 'localhost')
    'port'     => 3306,
    'dbname'   => 'u123456789_attendance', // Replace with your Hostinger database name
    'username' => 'u123456789_admin',      // Replace with your Hostinger DB username
    'password' => 'YourHostingerDbPassword', // Replace with your Hostinger DB password

    // ---------------------------------------------------------------
    // FALLBACK: PostgreSQL (Supabase) — uncomment to switch back
    // ---------------------------------------------------------------
    // 'driver'   => 'pgsql',
    // 'host'     => 'db.bmrpgkkminjgvpttujek.supabase.co',
    // 'port'     => 5432,
    // 'dbname'   => 'postgres',
    // 'username' => 'postgres',
    // 'password' => 'fWGXn7vCS.FAbJG',

    // ---------------------------------------------------------------
    // SQLite (local development only)
    // ---------------------------------------------------------------
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
