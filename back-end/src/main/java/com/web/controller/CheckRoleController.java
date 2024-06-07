package com.web.controller;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.Person;
import com.web.repository.NotificationRepository;
import com.web.repository.PersonRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CheckRoleController {
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    private final TokenUtils tokenUtils;

    public CheckRoleController(TokenUtils tokenUtils) {
        this.tokenUtils = tokenUtils;
    }

    @PostMapping("/check-authorization/admin")
    public ResponseEntity<?> checkAuthorization(@RequestHeader("Authorization") String token) {
        // Kiểm tra token và xác thực người dùng
        if (isValidToken(token)) {
            String tokenCheck = tokenUtils.extractToken(token);
            Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
            if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")){
                return ResponseEntity.ok("Authorized");
            }else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
    }

    private boolean isValidToken(String token) {
        // Kiểm tra xem token có tồn tại không
        if (token == null || token.isEmpty()) {
            return false;
        }

        return true;
    }

    @PostMapping("/check-authorization/student")
    public ResponseEntity<?> checkAuthorizationStudent(@RequestHeader("Authorization") String token) {
        // Kiểm tra token và xác thực người dùng
        if (isValidToken(token)) {
            String tokenCheck = tokenUtils.extractToken(token);
            Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
            if (personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")){
                return ResponseEntity.ok("Authorized");
            }else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
    }


    @PostMapping("/check-authorization/lecturer")
    public ResponseEntity<?> checkAuthorizationLecturer(@RequestHeader("Authorization") String token) {
        // Kiểm tra token và xác thực người dùng
        if (isValidToken(token)) {
            String tokenCheck = tokenUtils.extractToken(token);
            Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
            if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER")){
                return ResponseEntity.ok("Authorized");
            }else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
    }


    @PostMapping("/check-authorization/head")
    public ResponseEntity<?> checkAuthorizationHead(@RequestHeader("Authorization") String token) {
        // Kiểm tra token và xác thực người dùng
        if (isValidToken(token)) {
            String tokenCheck = tokenUtils.extractToken(token);
            Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
            if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")){
                return ResponseEntity.ok("authorized");
            }else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
    }
}
