package com.web.controller.admin;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.ContactRepository;
import com.web.repository.FeedbackRepository;
import com.web.repository.PersonRepository;
import com.web.utils.UserUtils;
import net.bytebuddy.implementation.bind.annotation.Pipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/feedback")
public class FeedbackController {
    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private UserUtils userUtils;

    @GetMapping("/listContact")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getListContact(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            List<Contact> contacts = contactRepository.findAll();
            return new ResponseEntity<>(contacts,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/contact-detail/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getDetailContact(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            Contact existedContact = contactRepository.findById(id).orElse(null);
            if (existedContact!=null){
                return new ResponseEntity<>(existedContact,HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/reply/{contactId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> replyContact(@PathVariable int contactId, @RequestHeader("Authorization") String authorizationHeader,
                                          @RequestParam("title") String title,
                                          @RequestParam("content") String content){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            Contact existedContact = contactRepository.findById(contactId).orElse(null);
            if (existedContact!=null){
                Feedback newFeedback = new Feedback();
                newFeedback.setContact(existedContact);
                newFeedback.setTitle(title);
                newFeedback.setContent(content);
                LocalDateTime now = LocalDateTime.now();
                newFeedback.setTime(now);
                var feed = feedbackRepository.save(newFeedback);
                existedContact.setFeedback(feed);
                existedContact.setStatus(true);
                contactRepository.save(existedContact);
                return new ResponseEntity<>(feedbackRepository,HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}

