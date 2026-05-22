package com.unidz.portal.service;

import com.unidz.portal.model.*;
import com.unidz.portal.repository.*;
import org.springframework.stereotype.Service;
import java.security.MessageDigest;
import java.util.*;

@Service
public class PortalService {

    private final LoginRepository loginRepository;
    private final StudentRepository studentRepository;
    private final ResultRepository resultRepository;

    public PortalService(LoginRepository loginRepository, StudentRepository studentRepository, ResultRepository resultRepository) {
        this.loginRepository = loginRepository;
        this.studentRepository = studentRepository;
        this.resultRepository = resultRepository;
    }

    public Optional<Student> authenticateAndFetchProfile(String username, String rawPassword) {
        Optional<Login> loginOpt = loginRepository.findByUsername(username);
        if (loginOpt.isEmpty()) return Optional.empty();

        Login creds = loginOpt.get();
        if (creds.getPassword().equals(hashSha256(rawPassword))) {
            return studentRepository.findById(creds.getId());
        }
        return Optional.empty();
    }

    public Optional<Result> getPerformanceMetrics(Integer studentId) {
        return resultRepository.findById(studentId);
    }

    private String hashSha256(String base) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(base.getBytes("UTF-8"));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}