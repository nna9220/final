package com.web.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

public class JwtUtils {
    public static Claims extractClaims(String jwtToken, String secretKey) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(jwtToken).getBody();
    }
}
