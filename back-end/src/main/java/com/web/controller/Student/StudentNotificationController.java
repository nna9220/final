package com.web.controller.Student;

import com.web.service.Admin.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/student/notification")
public class StudentNotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping()
    public ResponseEntity<?> getAllNotification(){
        try {
            return notificationService.getListNotification();
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }
}
