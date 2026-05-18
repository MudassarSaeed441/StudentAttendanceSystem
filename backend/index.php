<?php
/**
 * Student Attendance System - Front Controller & Routing Entry Point
 * Routing all API endpoints, handling authentication/roles, and matching frontend expectations.
 */

// --------------------------------------------------------------------
// 1. CORS Headers & HTTP Setup
// --------------------------------------------------------------------
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json; charset=utf-8');

// --------------------------------------------------------------------
// 2. Class Dependencies
// --------------------------------------------------------------------
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/JwtHelper.php';

// --------------------------------------------------------------------
// 3. Security & Middleware Helpers
// --------------------------------------------------------------------

/**
 * Standardizes Role outputs from DB integers/enums to PascalCase strings.
 */
function mapRole($role) {
    if ($role === 0 || $role === '0' || strtolower($role) === 'admin') {
        return 'Admin';
    }
    return 'Teacher';
}

/**
 * Parses and decodes the JWT token from the incoming request authorization headers.
 * @return array|null
 */
function getAuthenticatedUser() {
    $headers = getallheaders();
    $authHeader = '';
    
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) {
        $authHeader = $headers['authorization'];
    }
    
    if (preg_match('/Bearer\s(\S+)/i', $authHeader, $matches)) {
        $token = $matches[1];
        return JwtHelper::decode($token);
    }
    return null;
}

/**
 * Restricts access to a specific role. Rejects request with HTTP 401 if unauthorized.
 * @param string $role
 * @return array
 */
function requireRole($role) {
    $user = getAuthenticatedUser();
    if (!$user || mapRole($user['role']) !== $role) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized - Access Denied"]);
        exit;
    }
    return $user;
}

// --------------------------------------------------------------------
// 4. Request Parsing & Setup
// --------------------------------------------------------------------
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = '/' . trim($uri, '/'); // Normalize path
$method = $_SERVER['REQUEST_METHOD'];

$pdo = Database::getConnection();

// Helper to retrieve JSON payload
function getJsonPayload() {
    $body = file_get_contents('php://input');
    return json_decode($body, true) ?? [];
}

try {
    // ----------------------------------------------------------------
    // Route A: Authentication
    // ----------------------------------------------------------------
    if ($uri === '/api/auth/login' && $method === 'POST') {
        $data = getJsonPayload();
        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';
        
        if (empty($username) || empty($password)) {
            http_response_code(400);
            echo json_encode(["message" => "Username and password are required."]);
            exit;
        }

        $stmt = $pdo->prepare('SELECT * FROM "Users" WHERE LOWER("Username") = LOWER(?)');
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($password, $user['PasswordHash'])) {
            http_response_code(401);
            echo json_encode(["message" => "Invalid username or password."]);
            exit;
        }

        $mappedRole = mapRole($user['Role']);
        $token = JwtHelper::generate([
            "id" => $user['Id'],
            "username" => $user['Username'],
            "role" => $mappedRole
        ]);

        echo json_encode([
            "token" => $token,
            "username" => $user['Username'],
            "role" => $mappedRole
        ]);
        exit;
    }

    // ----------------------------------------------------------------
    // Route B: Admin Students
    // ----------------------------------------------------------------
    elseif ($uri === '/api/admin/students' && $method === 'GET') {
        requireRole('Admin');
        
        $stmt = $pdo->query('SELECT "Id" AS id, "Name" AS name, "StudentCode" AS "studentCode" FROM "Students" ORDER BY "Name" ASC');
        $students = [];
        while ($row = $stmt->fetch()) {
            $students[] = [
                "id" => (int)$row['id'],
                "name" => $row['name'],
                "studentCode" => $row['studentCode']
            ];
        }
        echo json_encode($students);
        exit;
    }

    elseif ($uri === '/api/admin/students' && $method === 'POST') {
        requireRole('Admin');
        $data = getJsonPayload();
        $name = trim($data['name'] ?? '');
        $studentCode = trim($data['studentCode'] ?? '');

        if (empty($name) || empty($studentCode)) {
            http_response_code(400);
            echo json_encode(["message" => "Student Name and Code are required."]);
            exit;
        }

        $stmt = $pdo->prepare('INSERT INTO "Students" ("Name", "StudentCode") VALUES (?, ?)');
        $stmt->execute([$name, $studentCode]);
        $id = $pdo->lastInsertId();

        echo json_encode([
            "id" => (int)$id,
            "name" => $name,
            "studentCode" => $studentCode
        ]);
        exit;
    }

    elseif (preg_match('#^/api/admin/students/(\d+)$#', $uri, $matches) && $method === 'PUT') {
        requireRole('Admin');
        $studentId = (int)$matches[1];
        $data = getJsonPayload();
        $name = trim($data['name'] ?? '');
        $studentCode = trim($data['studentCode'] ?? '');

        if (empty($name) || empty($studentCode)) {
            http_response_code(400);
            echo json_encode(["message" => "Student Name and Code are required."]);
            exit;
        }

        $stmt = $pdo->prepare('UPDATE "Students" SET "Name" = ?, "StudentCode" = ? WHERE "Id" = ?');
        $stmt->execute([$name, $studentCode, $studentId]);
        
        http_response_code(204); // No Content
        exit;
    }

    elseif (preg_match('#^/api/admin/students/(\d+)$#', $uri, $matches) && $method === 'DELETE') {
        requireRole('Admin');
        $studentId = (int)$matches[1];

        $stmt = $pdo->prepare('DELETE FROM "Students" WHERE "Id" = ?');
        $stmt->execute([$studentId]);
        
        http_response_code(204); // No Content
        exit;
    }

    // ----------------------------------------------------------------
    // Route C: Admin Teachers
    // ----------------------------------------------------------------
    elseif ($uri === '/api/admin/teachers' && $method === 'GET') {
        requireRole('Admin');
        
        $stmt = $pdo->query('
            SELECT t."Id" AS id, t."Name" AS name, t."UserId" AS "userId", u."Username" AS username, u."Role" AS role 
            FROM "Teachers" t 
            JOIN "Users" u ON t."UserId" = u."Id"
            ORDER BY t."Name" ASC
        ');
        $teachers = [];
        while ($row = $stmt->fetch()) {
            $teachers[] = [
                "id" => (int)$row['id'],
                "name" => $row['name'],
                "userId" => (int)$row['userId'],
                "user" => [
                    "id" => (int)$row['userId'],
                    "username" => $row['username'],
                    "role" => mapRole($row['role'])
                ]
            ];
        }
        echo json_encode($teachers);
        exit;
    }

    elseif ($uri === '/api/admin/teachers' && $method === 'POST') {
        requireRole('Admin');
        $data = getJsonPayload();
        $name = trim($data['name'] ?? '');
        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';

        if (empty($name) || empty($username) || empty($password)) {
            http_response_code(400);
            echo json_encode(["message" => "Name, username, and password are required."]);
            exit;
        }

        $pdo->beginTransaction();
        try {
            // 1. Insert into Users
            $passwordHash = password_hash($password, PASSWORD_BCRYPT);
            $roleValue = 1; // 1 = Teacher role
            
            $stmt = $pdo->prepare('INSERT INTO "Users" ("Username", "PasswordHash", "Role") VALUES (?, ?, ?)');
            $stmt->execute([$username, $passwordHash, $roleValue]);
            $userId = $pdo->lastInsertId();

            // 2. Insert into Teachers
            $stmt = $pdo->prepare('INSERT INTO "Teachers" ("Name", "UserId") VALUES (?, ?)');
            $stmt->execute([$name, $userId]);
            $teacherId = $pdo->lastInsertId();

            $pdo->commit();

            echo json_encode([
                "id" => (int)$teacherId,
                "name" => $name,
                "userId" => (int)$userId,
                "user" => [
                    "id" => (int)$userId,
                    "username" => $username,
                    "role" => "Teacher"
                ]
            ]);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(["message" => "Failed to create teacher account: " . $e->getMessage()]);
        }
        exit;
    }

    // ----------------------------------------------------------------
    // Route D: Admin Classes
    // ----------------------------------------------------------------
    elseif ($uri === '/api/admin/classes' && $method === 'GET') {
        requireRole('Admin');
        
        $stmt = $pdo->query('
            SELECT c."Id" AS id, c."Name" AS name, c."ClassCode" AS "classCode", c."TeacherId" AS "teacherId", t."Name" AS "teacherName", t."UserId" AS "teacherUserId"
            FROM "Classes" c
            JOIN "Teachers" t ON c."TeacherId" = t."Id"
            ORDER BY c."Name" ASC
        ');
        
        $classes = [];
        while ($row = $stmt->fetch()) {
            $classes[] = [
                "id" => (int)$row['id'],
                "name" => $row['name'],
                "classCode" => $row['classCode'],
                "teacherId" => (int)$row['teacherId'],
                "teacher" => [
                    "id" => (int)$row['teacherId'],
                    "name" => $row['teacherName'],
                    "userId" => (int)$row['teacherUserId']
                ]
            ];
        }
        echo json_encode($classes);
        exit;
    }

    elseif ($uri === '/api/admin/classes' && $method === 'POST') {
        requireRole('Admin');
        $data = getJsonPayload();
        $name = trim($data['name'] ?? '');
        $classCode = trim($data['classCode'] ?? '');
        $teacherId = (int)($data['teacherId'] ?? 0);

        if (empty($name) || empty($classCode) || $teacherId <= 0) {
            http_response_code(400);
            echo json_encode(["message" => "Class Name, Unique Code, and Assigned Teacher are required."]);
            exit;
        }

        $stmt = $pdo->prepare('INSERT INTO "Classes" ("Name", "ClassCode", "TeacherId") VALUES (?, ?, ?)');
        $stmt->execute([$name, $classCode, $teacherId]);
        $classId = $pdo->lastInsertId();

        // Retrieve Assigned Teacher Details to return nested model
        $stmt = $pdo->prepare('SELECT "Name" FROM "Teachers" WHERE "Id" = ?');
        $stmt->execute([$teacherId]);
        $teacherName = $stmt->fetchColumn() ?: '';

        echo json_encode([
            "id" => (int)$classId,
            "name" => $name,
            "classCode" => $classCode,
            "teacherId" => $teacherId,
            "teacher" => [
                "id" => $teacherId,
                "name" => $teacherName
            ]
        ]);
        exit;
    }

    // ----------------------------------------------------------------
    // Route E: Admin Enrollments
    // ----------------------------------------------------------------
    elseif ($uri === '/api/admin/enroll' && $method === 'POST') {
        requireRole('Admin');
        $data = getJsonPayload();
        $studentId = (int)($data['studentId'] ?? 0);
        $classId = (int)($data['classId'] ?? 0);

        if ($studentId <= 0 || $classId <= 0) {
            http_response_code(400);
            echo json_encode(["message" => "studentId and classId are required."]);
            exit;
        }

        $stmt = $pdo->prepare('INSERT INTO "Enrollments" ("StudentId", "ClassId") VALUES (?, ?)');
        $stmt->execute([$studentId, $classId]);

        echo json_encode([
            "studentId" => $studentId,
            "classId" => $classId
        ]);
        exit;
    }

    // ----------------------------------------------------------------
    // Route F: Admin Dashboard Stats
    // ----------------------------------------------------------------
    elseif ($uri === '/api/admin/stats' && $method === 'GET') {
        requireRole('Admin');
        
        $studentsCount = (int)$pdo->query('SELECT COUNT(*) FROM "Students"')->fetchColumn();
        $teachersCount = (int)$pdo->query('SELECT COUNT(*) FROM "Teachers"')->fetchColumn();
        $classesCount = (int)$pdo->query('SELECT COUNT(*) FROM "Classes"')->fetchColumn();
        
        $today = date('Y-m-d');
        // CAST("Date" AS DATE) is SQL standard for cross-database date comparisons
        $stmt = $pdo->prepare('SELECT COUNT(*) FROM "Attendances" WHERE CAST("Date" AS DATE) = ?');
        $stmt->execute([$today]);
        $attendanceTodayCount = (int)$stmt->fetchColumn();

        echo json_encode([
            "students" => $studentsCount,
            "teachers" => $teachersCount,
            "classes" => $classesCount,
            "attendanceToday" => $attendanceTodayCount
        ]);
        exit;
    }

    // ----------------------------------------------------------------
    // Route G: Teacher My Classes
    // ----------------------------------------------------------------
    elseif ($uri === '/api/teacher/my-classes' && $method === 'GET') {
        $user = requireRole('Teacher');
        $userId = $user['id'];

        // Get Teacher profile matching User's account
        $stmt = $pdo->prepare('SELECT "Id" FROM "Teachers" WHERE "UserId" = ?');
        $stmt->execute([$userId]);
        $teacherId = $stmt->fetchColumn();
        
        if (!$teacherId) {
            http_response_code(404);
            echo json_encode(["message" => "Teacher profile not found for authenticated user."]);
            exit;
        }

        // Fetch assigned classes
        $stmt = $pdo->prepare('SELECT "Id" AS id, "Name" AS name, "ClassCode" AS "classCode", "TeacherId" AS "teacherId" FROM "Classes" WHERE "TeacherId" = ? ORDER BY "Name" ASC');
        $stmt->execute([$teacherId]);
        $classes = [];
        while ($row = $stmt->fetch()) {
            $classes[] = [
                "id" => (int)$row['id'],
                "name" => $row['name'],
                "classCode" => $row['classCode'],
                "teacherId" => (int)$row['teacherId']
            ];
        }
        
        echo json_encode($classes);
        exit;
    }

    // ----------------------------------------------------------------
    // Route H: Teacher Class Students
    // ----------------------------------------------------------------
    elseif (preg_match('#^/api/teacher/class-students/(\d+)$#', $uri, $matches) && $method === 'GET') {
        requireRole('Teacher');
        $classId = (int)$matches[1];

        // Fetch enrolled students
        $stmt = $pdo->prepare('
            SELECT s."Id" AS id, s."Name" AS name, s."StudentCode" AS "studentCode" 
            FROM "Enrollments" e
            JOIN "Students" s ON e."StudentId" = s."Id"
            WHERE e."ClassId" = ?
            ORDER BY s."Name" ASC
        ');
        $stmt->execute([$classId]);
        
        $students = [];
        while ($row = $stmt->fetch()) {
            $students[] = [
                "id" => (int)$row['id'],
                "name" => $row['name'],
                "studentCode" => $row['studentCode']
            ];
        }
        
        echo json_encode($students);
        exit;
    }

    // ----------------------------------------------------------------
    // Route I: Teacher Mark Attendance
    // ----------------------------------------------------------------
    elseif ($uri === '/api/teacher/mark-attendance' && $method === 'POST') {
        requireRole('Teacher');
        $data = getJsonPayload();
        $classId = (int)($data['classId'] ?? 0);
        $records = $data['records'] ?? [];

        if ($classId <= 0) {
            http_response_code(400);
            echo json_encode(["message" => "classId and records are required."]);
            exit;
        }

        $today = date('Y-m-d');
        $pdo->beginTransaction();
        try {
            // 1. Remove today's existing records for the class to allow updates/corrections
            $stmt = $pdo->prepare('DELETE FROM "Attendances" WHERE "ClassId" = ? AND CAST("Date" AS DATE) = ?');
            $stmt->execute([$classId, $today]);

            // 2. Insert the new records
            $stmt = $pdo->prepare('INSERT INTO "Attendances" ("ClassId", "StudentId", "Date", "IsPresent") VALUES (?, ?, ?, ?)');
            
            $dateTimeString = date('Y-m-d H:i:s');
            foreach ($records as $record) {
                $studentId = (int)$record['studentId'];
                $isPresent = $record['isPresent'] ? 1 : 0;
                
                $stmt->execute([$classId, $studentId, $dateTimeString, $isPresent]);
            }

            $pdo->commit();
            echo json_encode(["message" => "Attendance recorded successfully."]);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(["message" => "Failed to save attendance: " . $e->getMessage()]);
        }
        exit;
    }

    // ----------------------------------------------------------------
    // Route J: Page Not Found (HTTP 404)
    // ----------------------------------------------------------------
    else {
        http_response_code(404);
        echo json_encode([
            "message" => "Route not found.",
            "requested_uri" => $uri,
            "requested_method" => $method
        ]);
        exit;
    }

} catch (PDOException $e) {
    // Gracefully handle database-specific errors (such as duplicate index violations)
    http_response_code(400);
    echo json_encode([
        "message" => "Database request failed.",
        "error" => $e->getMessage()
    ]);
    exit;
} catch (Exception $e) {
    // Catch-all general errors
    http_response_code(500);
    echo json_encode([
        "message" => "An unexpected error occurred.",
        "error" => $e->getMessage()
    ]);
    exit;
}
