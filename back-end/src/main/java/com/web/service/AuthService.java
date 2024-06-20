package com.web.service;

import com.web.entity.ExpiredToken;
import com.web.repository.ExpiredTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthService {

    @Autowired
    private ExpiredTokenRepository expiredTokenRepository;

    public void logoutAndSaveToken(String token) {
        ExpiredToken expiredToken = new ExpiredToken();
        expiredToken.setToken(token);
        expiredToken.setExpiredAt(new Date());
        expiredTokenRepository.save(expiredToken);
    }

}
