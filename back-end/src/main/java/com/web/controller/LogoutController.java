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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader("Authorization") String authorizationHeader) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent == null) {
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}