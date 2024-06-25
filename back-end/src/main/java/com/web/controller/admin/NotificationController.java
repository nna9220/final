package com.web.controller.admin;

import com.web.repository.NotificationRepository;
import com.web.service.Admin.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/notification")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping()
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getAllNotification(){
        try {
            return new ResponseEntity<>(notificationRepository.findAll(), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createNotification(@RequestHeader("Authorization") String authorizationHeader,
                                                @RequestParam("content") String content,
                                                @RequestParam("persons") List<String> persons,
                                                @RequestParam("title") String title){
        try {
            return notificationService.createNotification(persons,authorizationHeader,content,title);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/edit/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
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
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
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
