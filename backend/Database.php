<?php
/**
 * Student Attendance System - Database Helper
 * Uses PDO for database-agnostic standard SQL queries.
 */

class Database {
    private static $pdo = null;

    /**
     * Retrieves the active database connection.
     * @return PDO
     */
    public static function getConnection() {
        if (self::$pdo === null) {
            $config = require __DIR__ . '/config.php';
            try {
                if ($config['driver'] === 'sqlite') {
                    $dsn = "sqlite:" . $config['sqlite_path'];
                    self::$pdo = new PDO($dsn);
                } elseif ($config['driver'] === 'pgsql') {
                    $dsn = "pgsql:host={$config['host']};port={$config['port']};dbname={$config['dbname']}";
                    self::$pdo = new PDO($dsn, $config['username'], $config['password']);
                } else { // mysql
                    $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$config['dbname']};charset=utf8mb4";
                    self::$pdo = new PDO($dsn, $config['username'], $config['password']);
                }
                
                // Configure PDO options for safety and reliability
                self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                
                // If using SQLite, enable foreign keys support
                if ($config['driver'] === 'sqlite') {
                    self::$pdo->exec("PRAGMA foreign_keys = ON;");
                }
                
                // If using MySQL, force ANSI_QUOTES mode to support EF Core standard double quotes for identifiers
                if ($config['driver'] === 'mysql') {
                    self::$pdo->exec("SET sql_mode='ANSI_QUOTES,NO_ENGINE_SUBSTITUTION';");
                }
                
            } catch (PDOException $e) {
                // Return descriptive database errors
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    "message" => "Database connection failed",
                    "error" => $e->getMessage()
                ]);
                exit;
            }
        }
        return self::$pdo;
    }
}
