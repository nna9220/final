package com.web.controller.admin;

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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/check-authorization")
@CrossOrigin(origins = {"https://hcmute.workon.space", "http://localhost:3000"})
public class CheckRoleController {
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;

    private final TokenUtils tokenUtils;

    public CheckRoleController(TokenUtils tokenUtils) {
        this.tokenUtils = tokenUtils;
    }

    @PostMapping("/admin")
    public ResponseEntity<?> checkAuthorization(@RequestHeader("Authorization") String token) {
        // Kiểm tra token và xác thực người dùng
        if (isValidToken(token)) {
            String tokenCheck = tokenUtils.extractToken(token);
            Person personCurrent = CheckRole.getRoleCurrent2(tokenCheck,userUtils,personRepository);
            System.out.println("Trước chekc role");
            if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")){
                System.out.println("check role successful");
                return ResponseEntity.ok("Authorized");
            }else {
                System.out.println("Sau else");
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

    @PostMapping("/student")
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


    @PostMapping("/lecturer")
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


    @PostMapping("/head")
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
