package com.web.config;

import org.springframework.stereotype.Component;

@Component
public class TokenUtils {
    public String extractToken(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            System.out.println("TokenUtils bean is created");
            return authorizationHeader.substring(7);
        }
        System.out.println("TokenUtils bean iss null");
        return null;
    }
    // Thêm các phương thức xử lý token khác nếu cần

}
