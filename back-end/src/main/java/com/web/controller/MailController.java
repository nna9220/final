/*
package com.web.controller;

import com.web.config.CheckRole;
import com.web.entity.MailStructure;
import com.web.entity.Person;
import com.web.repository.PersonRepository;
import com.web.service.MailService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/mail")
public class MailController {
    @Autowired
    private MailService mailService;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private PersonRepository personRepository;
    @PostMapping("/send")
    public String sendMail(@RequestParam String messenger, HttpSession session){
        Person personCurrent = CheckRole.getRoleCurrent(session, userUtils, personRepository);
        MailStructure newMail = new MailStructure();
        String subject = "Change task";
        newMail.setSubject(subject);
        newMail.setMessenger(messenger);
        mailService.sendMail(personCurrent.getUsername(),newMail);
        return "Successfully send the email";
    }
}
*/
