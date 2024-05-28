package com.web.controller.HeadOfDepartment;

import com.web.service.Admin.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/head/notification")
public class HeadNotificationController {
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
