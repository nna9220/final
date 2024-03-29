package com.web.config;

import org.springframework.stereotype.Component;

@Component
public class TokenUtils {
    public String extractToken(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }
    // Thêm các phương thức xử lý token khác nếu cần

}
