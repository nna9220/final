package com.web.jwt;

import com.web.repository.PersonRepository;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

public class JWTConfigurer extends SecurityConfigurerAdapter<DefaultSecurityFilterChain, HttpSecurity>{

    private final JwtTokenProvider tokenProvider;

    private final PersonRepository userRepository;

    public JWTConfigurer(JwtTokenProvider tokenProvider, PersonRepository userRepository) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    public void configure(HttpSecurity http) {
        JwtAuthenticationFilter customFilter = new JwtAuthenticationFilter(tokenProvider, userRepository);
        http.addFilterBefore(customFilter, UsernamePasswordAuthenticationFilter.class);
    }
}

