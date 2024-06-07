package com.web.controller.Lecturer;

import com.web.service.Admin.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/lecturer/notification")
public class LecturerNotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping()
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> getAllNotification(){
        try {
            return notificationService.getListNotification();
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }
}
