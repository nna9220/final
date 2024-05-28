package com.web.controller.admin;

import com.web.service.Admin.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/admin/notification")
public class NotificationController {
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

    @PostMapping("/create")
    public ResponseEntity<?> createNotification(@RequestHeader("Authorization") String authorizationHeader,
                                                @RequestParam("content") String content,
                                                @RequestParam("title") String title){
        try {
            return notificationService.createNotification(authorizationHeader,content,title);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<?> editNotification(@RequestHeader("Authorization") String authorizationHeader,
                                              @RequestParam("content") String content,
                                              @RequestParam("title") String title,
                                              @PathVariable int id){
        try {
            return notificationService.editNotification(authorizationHeader,id,content,title);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteNotification(@RequestHeader("Authorization") String authorizationHeader,
                                              @PathVariable int id){
        try {
            return notificationService.deleteNotification(authorizationHeader,id);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }
}
