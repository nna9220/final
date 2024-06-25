package com.web.controller.HeadOfDepartment;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.Person;
import com.web.repository.PersonRepository;
import com.web.service.Admin.NotificationService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/head/notification")
public class HeadNotificationController {
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private UserUtils userUtils;

    @GetMapping()
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
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
