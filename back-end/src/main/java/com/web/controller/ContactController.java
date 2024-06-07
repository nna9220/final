package com.web.controller;

import com.web.entity.Contact;
import com.web.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/public/contact")
public class ContactController {
    @Autowired
    private ContactRepository contactRepository;
    @PostMapping("/create")
    public ResponseEntity<?> createContact(@RequestParam("name") String name,
                                           @RequestParam("email") String email,
                                           @RequestParam("phone") String phone,
                                           @RequestParam("content") String content){
        try {
            Contact newContact = new Contact();
            newContact.setStatus(false);
            newContact.setName(name);
            newContact.setEmail(email);
            newContact.setPhone(phone);
            newContact.setContent(content);
            LocalDateTime now = LocalDateTime.now();
            newContact.setTime(now);
            contactRepository.save(newContact);
            return new ResponseEntity<>(newContact, HttpStatus.CREATED);
        }catch (Exception e){
            throw new ExceptionInInitializerError(e);
        }
    }
}
