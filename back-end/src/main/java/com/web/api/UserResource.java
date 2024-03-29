package com.web.api;

import com.web.dto.*;
import com.web.jwt.JwtTokenProvider;
import com.web.repository.PersonRepository;
import com.web.service.UserService;
import com.web.utils.MailService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class UserResource {

    private final PersonRepository userRepository;

    private final JwtTokenProvider jwtTokenProvider;

    private final UserUtils userUtils;

    private final MailService mailService;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResource(PersonRepository userRepository, JwtTokenProvider jwtTokenProvider, UserUtils userUtils, MailService mailService) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userUtils = userUtils;
        this.mailService = mailService;
    }

    @PostMapping("/login")
    public TokenDto authenticate(@RequestBody LoginDto loginDto) throws Exception {
        TokenDto tokenDto = userService.login(loginDto.getUsername(), loginDto.getPassword());
        return tokenDto;
    }

    @GetMapping("/admin/check-role-admin")
    public void checkRoleAdmin(){
        System.out.println("admin");
    }

    @GetMapping("/user/check-role-user")
    public void checkRoleUser(){
        System.out.println("user");
    }

}
