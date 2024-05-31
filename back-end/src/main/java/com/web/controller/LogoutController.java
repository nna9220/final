package com.web.controller;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.Lecturer;
import com.web.entity.Person;
import com.web.entity.Subject;
import com.web.repository.PersonRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.HashMap;
import java.util.Map;

@Controller
public class LogoutController {

    private final TokenUtils tokenUtils;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private PersonRepository personRepository;


    public LogoutController(TokenUtils tokenUtils) {
        this.tokenUtils = tokenUtils;
    }

    @PostMapping("/api/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authorizationHeader) {
        // Trích xuất token từ tiêu đề Authorization
        String token = extractToken(authorizationHeader);

        if (token == null || token.isEmpty()) {
            // Trả về lỗi nếu không có token
            return ResponseEntity.badRequest().build();
        }

        // Thực hiện logic đăng xuất ở đây
        // Ví dụ: Vô hiệu hóa phiên hoặc token của người dùng

        // Xóa tất cả thông tin xác thực khỏi bộ nhớ và đăng xuất người dùng
        SecurityContextHolder.clearContext();

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
}