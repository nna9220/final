package com.web.controller.admin;

import com.web.config.TokenUtils;
import com.web.entity.Notification;
import com.web.entity.Person;
import com.web.repository.NotificationRepository;
import com.web.repository.PersonRepository;
import com.web.service.Admin.LecturerService;
import com.web.service.Admin.NotificationService;
import com.web.service.Admin.StudentService;
import com.web.config.CheckRole;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private StudentService studentService;

    @Autowired
    private LecturerService lecturerService;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    public NotificationController(TokenUtils tokenUtils) {
        this.tokenUtils = tokenUtils;
    }
    @GetMapping()
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getAllNotification() {
        try {
            return new ResponseEntity<>(notificationRepository.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createNotification(@RequestParam(required = false) List<String> persons, // Đổi tên từ emailPerson thành persons
                                                @RequestHeader("Authorization") String authorizationHeader,
                                                @RequestParam String content,
                                                @RequestParam String title,
                                                @RequestParam(required = false) String recipientType) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);

        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            List<Person> personList = new ArrayList<>();

            if ("student".equalsIgnoreCase(recipientType)) {
                // Gửi thông báo cho tất cả sinh viên
                List<String> studentEmails = personRepository.getAllStudentEmails();
                for (String email : studentEmails) {
                    Person p = personRepository.findByUsername(email).orElse(null);
                    if (p != null) {
                        personList.add(p);
                    }
                }
            } else if ("lecturer".equalsIgnoreCase(recipientType)) {
                // Gửi thông báo cho tất cả giảng viên
                List<String> lecturerEmails = personRepository.getAllLecturerEmails();
                for (String email : lecturerEmails) {
                    Person p = personRepository.findByUsername(email).orElse(null);
                    if (p != null) {
                        personList.add(p);
                    }
                }
            } else if (persons != null && !persons.isEmpty()) {
                // Gửi thông báo đến danh sách email cụ thể
                personList = personRepository.findByUsernameIn(persons);
                System.out.println("Email: " + persons);
            }

            // Tạo và lưu thông báo
            Notification notification = new Notification();
            notification.setContent(content);
            notification.setPersons(personList);
            notification.setTitle(title);
            LocalDateTime now = LocalDateTime.now();
            notification.setDateSubmit(now);
            notificationRepository.save(notification);

            return new ResponseEntity<>(notification, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


    @PostMapping("/edit/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> editNotification(@RequestHeader("Authorization") String authorizationHeader,
                                              @RequestParam("content") String content,
                                              @RequestParam("title") String title,
                                              @PathVariable int id) {
        try {
            return notificationService.editNotification(authorizationHeader, id, content, title);
        } catch (Exception e) {
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteNotification(@RequestHeader("Authorization") String authorizationHeader,
                                                @PathVariable int id) {
        try {
            return notificationService.deleteNotification(authorizationHeader, id);
        } catch (Exception e) {
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }
}
