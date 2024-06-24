package com.web.controller.Student;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.Person;
import com.web.repository.PersonRepository;
import com.web.service.Admin.NotificationService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student/notification")
public class StudentNotificationController {
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private UserUtils userUtils;

    @GetMapping()
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<?> getAllNotification(@RequestHeader("Authorization") String authorizationHeader){
        try {
            String token = tokenUtils.extractToken(authorizationHeader);
            Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
            return notificationService.getListNotification(personCurrent);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }
}
