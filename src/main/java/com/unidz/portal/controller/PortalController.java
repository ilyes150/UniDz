package com.unidz.portal.controller;

import com.unidz.portal.model.*;
import com.unidz.portal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/portal")
public class PortalController {

    @Autowired private LoginRepository     loginRepository;
    @Autowired private StudentRepository   studentRepository;
    @Autowired private ResultRepository    resultRepository;
    @Autowired private Semester1Repository semester1Repository;
    @Autowired private Semester2Repository semester2Repository;
    @Autowired private Semester3Repository semester3Repository;

    /**
     * Authenticates a student using SHA-256:  sha256("science" + studentCode.substring(4))
     * Matches the SQL initialisation in login.sql:
     *   encode(sha256(concat('science', substring(student_code from 5))::bytea), 'hex')
     *
     * Note: PostgreSQL's substring(str from 5) is 1-indexed, so it skips the first 4
     * characters — equivalent to Java's String.substring(4).
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateStudent(@RequestBody Map<String, String> credentials) {
        String username      = credentials.get("username");
        String passwordInput = credentials.get("password");

        if (username == null || passwordInput == null || username.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Bad Request: Username and password are required."));
        }

        String trimmedUsername = username.trim();

        if (trimmedUsername.length() < 5) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication rejected: Invalid Student Code format."));
        }

        // Locate login record
        Optional<Login> loginRecord = loginRepository.findByUsername(trimmedUsername);
        if (loginRecord.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication rejected: Invalid Student Code."));
        }

        // Replicate SQL: concat('science', substring(student_code from 5))
        String hashedInput = computeSHA256(passwordInput);

        // Compare hashes (case-insensitive for hex strings)
        if (!hashedInput.equalsIgnoreCase(loginRecord.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication rejected: Invalid Security Access Key."));
        }

        // Load student profile
        Optional<Student> studentProfile = studentRepository.findById(loginRecord.get().getId());
        if (studentProfile.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Data Integrity Error: Linked profile record not found."));
        }

        Result generalMetrics = resultRepository.findById(studentProfile.get().getId()).orElse(null);

        return ResponseEntity.ok(Map.of(
            "student", studentProfile.get(),
            "metrics", generalMetrics != null ? generalMetrics : Map.of("rank", "N/A")
        ));
    }

    /**
     * Returns raw semester data for the given semester number and student ID.
     */
    @GetMapping("/semester/{semNum}")
    public ResponseEntity<?> getSemesterGrades(
            @PathVariable int semNum,
            @RequestParam Integer studentId) {

        if (studentId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Missing required query parameter: studentId"));
        }

        return switch (semNum) {
            case 1 -> {
                Optional<Semester1> s1 = semester1Repository.findById(studentId);
                yield s1.isPresent()
                        ? ResponseEntity.ok(s1.get())
                        : ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of("error", "No records found for Semester 1"));
            }
            case 2 -> {
                Optional<Semester2> s2 = semester2Repository.findById(studentId);
                yield s2.isPresent()
                        ? ResponseEntity.ok(s2.get())
                        : ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of("error", "No records found for Semester 2"));
            }
            case 3 -> {
                Optional<Semester3> s3 = semester3Repository.findById(studentId);
                yield s3.isPresent()
                        ? ResponseEntity.ok(s3.get())
                        : ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of("error", "No records found for Semester 3"));
            }
            default -> ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Requested semester is locked or out of range."));
        };
    }

    /**
     * SHA-256 hex digest utility.
     */
    private String computeSHA256(String input) {
        try {
            MessageDigest digest  = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash    = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexStr  = new StringBuilder();
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexStr.append('0');
                hexStr.append(hex);
            }
            return hexStr.toString();
        } catch (Exception ex) {
            throw new RuntimeException("SHA-256 computation failed", ex);
        }
    }
}