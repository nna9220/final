package com.web.service.Admin;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.NotificationRepository;
import com.web.repository.PersonRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    public ResponseEntity<?> getListNotification(Person person){
            List<Notification> notifications = notificationRepository.findByPersons(person);
        System.out.println("Notifications: " + notifications);

        return new ResponseEntity<>(notifications,HttpStatus.OK);
    }

    public ResponseEntity<?> createNotification(List<String> emailPerson,String authorizationHeader, String content, String title){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            List<Person> personList = new ArrayList<>();
            for (String s:emailPerson) {
                Person p = personRepository.findUsername(s);
                if (p!=null){
                    personList.add(p);
                }
            }
            Notification notification = new Notification();
            notification.setContent(content);
            notification.setPersons(personList);
            notification.setTitle(title);
            LocalDateTime now = LocalDateTime.now();
            notification.setDateSubmit(now);
            notificationRepository.save(notification);
            return new ResponseEntity<>(notification,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    public ResponseEntity<?> editNotification(String authorizationHeader, int id, String content, String title){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            Notification notification = notificationRepository.findById(id).orElse(null);
            if (notification != null) {
                notification.setContent(content);
                notification.setTitle(title);
                notificationRepository.save(notification);
                return new ResponseEntity<>(notification, HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    public ResponseEntity<?> deleteNotification(String authorizationHeader, int id){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            Notification notification = notificationRepository.findById(id).orElse(null);
            if (notification != null) {
                notificationRepository.delete(notification);
                return new ResponseEntity<>( HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
