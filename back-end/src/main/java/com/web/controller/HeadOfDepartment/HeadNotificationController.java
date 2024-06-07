package com.web.controller.HeadOfDepartment;

import com.web.service.Admin.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/head/notification")
public class HeadNotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping()
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> getAllNotification(){
        try {
            return notificationService.getListNotification();
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }
}
