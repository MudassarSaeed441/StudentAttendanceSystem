<?php
/**
 * Student Attendance System - Configuration
 * Supports PostgreSQL, MySQL, and SQLite drivers.
 */

return [
    // Database driver choice: 'pgsql', 'mysql', or 'sqlite'
    'driver' => 'pgsql',
    
    // PostgreSQL / MySQL Settings (Defaults to your Supabase PostgreSQL instance)
    'host' => 'db.bmrpgkkminjgvpttujek.supabase.co',
    'port' => 5432,
    'dbname' => 'postgres',
    'username' => 'postgres',
    'password' => 'fWGXn7vCS.FAbJG',
    
    // SQLite Settings
    'sqlite_path' => __DIR__ . '/attendance.db',
    
    // JWT Authentication Settings
    'jwt' => [
        'key' => 'A_Very_Secret_Key_That_Is_Long_Enough_To_Be_Secure_1234567890',
        'issuer' => 'AttendanceSystem',
        'audience' => 'AttendanceSystemUsers',
        'expiration' => 7 * 24 * 60 * 60 // 7 days in seconds (match EF Core token lifetime)
    ]
];
