package com.web.controller.admin;

import com.web.config.CheckRole;
import com.web.config.JwtUtils;
import com.web.config.TokenUtils;
import com.web.dto.request.PersonRequest;
import com.web.entity.Lecturer;
import com.web.entity.Person;
import com.web.repository.PersonRepository;
import com.web.service.Admin.PersonService;
import com.web.utils.Contains;
import com.web.utils.UserUtils;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import com.web.config.JwtUtils;
import com.web.utils.UserUtils;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class HomeAdminController {
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private PersonService personService;
    @Autowired
    private PersonRepository personRepository;
    private final TokenUtils tokenUtils;
    @Autowired
    public HomeAdminController(TokenUtils tokenUtils) {
        this.tokenUtils = tokenUtils;
    }
    @GetMapping("/home")
    public ResponseEntity<?> getHome(@RequestHeader("Authorization") String authorizationHeader, HttpServletRequest request) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            // Trả về trang HTML với ModelAndView
            /*ModelAndView modelAndView = new ModelAndView("Dashboard_Admin");
            modelAndView.addObject("person", personCurrent);*/
            return new ResponseEntity<>(personCurrent, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent != null && personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            Person person = personRepository.findById(personCurrent.getPersonId()).orElse(null);
            ModelAndView modelAndView = new ModelAndView("profileAdmin");
            modelAndView.addObject("person", personCurrent);
            return new ResponseEntity<>(personCurrent, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    @GetMapping("/edit")
    public ResponseEntity<?> getEditProfile(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent != null && personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            Person person = personRepository.findById(personCurrent.getPersonId()).orElse(null);
            return new ResponseEntity<>(person,HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<?> updateLecturer(@RequestHeader("Authorization") String authorizationHeader, @PathVariable String id,@ModelAttribute PersonRequest studentRequest){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            Person existPerson = personRepository.findById(id).orElse(null);
            if (existPerson!=null){
                System.out.println(id);
                existPerson.setFirstName(studentRequest.getFirstName());
                existPerson.setLastName(studentRequest.getLastName());
                existPerson.setBirthDay(String.valueOf(studentRequest.getBirthDay()));
                existPerson.setPhone(studentRequest.getPhone());
                existPerson.setStatus(studentRequest.isStatus());

                personRepository.save(existPerson);
               /* String referer = Contains.URL_LOCAL + "/api/admin/profile";
                System.out.println("Url: " + referer);*/
                // Thực hiện redirect trở lại trang trước đó
                return new ResponseEntity<>(HttpStatus.OK);

            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
