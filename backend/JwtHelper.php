<?php
/**
 * Student Attendance System - JWT Helper
 * Lightweight, zero-dependency JWT encoder and decoder with expiration checks.
 */

class JwtHelper {
    /**
     * Encodes string data to base64url.
     * @param string $data
     * @return string
     */
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Decodes base64url data to string.
     * @param string $data
     * @return string
     */
    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }

    /**
     * Generates a signed JWT for a given payload.
     * @param array $payload
     * @return string
     */
    public static function generate($payload) {
        $config = require __DIR__ . '/config.php';
        $jwtSettings = $config['jwt'];

        // Header
        $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
        $base64UrlHeader = self::base64UrlEncode($header);
        
        // Standard JWT claim configurations
        $payload['iss'] = $jwtSettings['issuer'];
        $payload['aud'] = $jwtSettings['audience'];
        $payload['exp'] = time() + $jwtSettings['expiration'];
        $payload['nbf'] = time();
        $payload['iat'] = time();

        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));
        
        // Signature calculation
        $signature = hash_hmac('sha256', "$base64UrlHeader.$base64UrlPayload", $jwtSettings['key'], true);
        $base64UrlSignature = self::base64UrlEncode($signature);
        
        return "$base64UrlHeader.$base64UrlPayload.$base64UrlSignature";
    }

    /**
     * Decodes and validates a JWT, returning the payload if valid or null if invalid.
     * @param string $token
     * @return array|null
     */
    public static function decode($token) {
        $config = require __DIR__ . '/config.php';
        $jwtSettings = $config['jwt'];

        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }
        
        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $parts;
        
        $signature = self::base64UrlDecode($base64UrlSignature);
        $expectedSignature = hash_hmac('sha256', "$base64UrlHeader.$base64UrlPayload", $jwtSettings['key'], true);
        
        // Constant-time string comparison to defend against timing attacks
        if (!hash_equals($signature, $expectedSignature)) {
            return null;
        }
        
        $payload = json_decode(self::base64UrlDecode($base64UrlPayload), true);
        
        // Token expiration verification
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }
        
        return $payload;
    }
}
