package com.web.controller;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.Lecturer;
import com.web.entity.Person;
import com.web.entity.Subject;
import com.web.repository.ExpiredTokenRepository;
import com.web.repository.PersonRepository;
import com.web.service.AuthService;
import com.web.utils.UserUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Controller
public class LogoutController {

    private final TokenUtils tokenUtils;
    private final String JWT_SECRET = "f2f1035db6a255e7885838b020f370d702d4bb0f35a368f06ded1ce8e6684a27";

    @Autowired
    private UserUtils userUtils;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private AuthService authService;
    @Autowired
    private ExpiredTokenRepository expiredTokenRepository;


    public LogoutController(TokenUtils tokenUtils) {
        this.tokenUtils = tokenUtils;
    }

    @PostMapping("/api/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authorizationHeader) {
        String token = extractToken(authorizationHeader);
        authService.logoutAndSaveToken(token);
        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        // Tạo một token hết hạn ngay lập tức
        String expiredToken = createExpiredToken(token);

        // Trả về mã trạng thái 200 OK để chỉ ra rằng đăng xuất thành công
        return ResponseEntity.ok().build();
    }

    // Phương thức để trích xuất token từ tiêu đề Authorization
    private String extractToken(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }

    // Phương thức để tạo token hết hạn ngay lập tức
    private String createExpiredToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(JWT_SECRET)
                .parseClaimsJws(token)
                .getBody();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() - 1000); // Hết hạn ngay lập tức

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .compact();
    }
}