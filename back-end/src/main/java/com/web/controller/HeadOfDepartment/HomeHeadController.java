package com.web.controller.HeadOfDepartment;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.Lecturer;
import com.web.entity.Person;
import com.web.entity.Subject;
import com.web.entity.TypeSubject;
import com.web.repository.LecturerRepository;
import com.web.repository.PersonRepository;
import com.web.repository.SubjectRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/head")
public class HomeHeadController {
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    private final TokenUtils tokenUtils;
    @Autowired
    public HomeHeadController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }

    @GetMapping("/counterArgumentSubject/detail/{id}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<Map<String,Object>> getDetailCounterArgument(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent != null && personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer currentLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject existSubject = subjectRepository.findById(id).orElse(null);
            Map<String,Object> response = new HashMap<>();
            response.put("person",personCurrent);
            response.put("lec",currentLecturer);
            response.put("subject",existSubject);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            /*return new ModelAndView("error").addObject("errorMessage", "Bạn không có quyền truy cập.");*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/addScore/{id}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> addScore(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader, @RequestParam Double score){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject existSubject = subjectRepository.findById(id).orElse(null);
            if (existSubject!=null){
                /*existSubject.setScoreThesis(score);*/
                subjectRepository.save(existSubject);
                return new ResponseEntity<>(existSubject,HttpStatus.OK);

            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/counterArgumentSubject")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<Map<String,Object>> getCounterArgument(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent != null && personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer currentLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            List<Subject> listSubject = subjectRepository.findSubjectsByThesisAdvisorId(currentLecturer,typeSubject);

            Map<String,Object> response = new HashMap<>();
            response.put("person", personCurrent);
            response.put("lec",currentLecturer);
            response.put("listSubject", listSubject);
            return new ResponseEntity<>(response,HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/home")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> getHome(@RequestHeader("Authorization") String authorizationHeader) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            return new ResponseEntity<>(personCurrent,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<Map<String,Object>> getProfile(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent != null && personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer currentLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);

            Map<String,Object> response = new HashMap<>();
            response.put("person",personCurrent);
            response.put("lec",currentLecturer);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            /*return new ModelAndView("error").addObject("errorMessage", "Bạn không có quyền truy cập.");*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    @GetMapping("/edit")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> getEditProfile(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent != null && personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Person person = personRepository.findById(personCurrent.getPersonId()).orElse(null);

            return new ResponseEntity<>(person,HttpStatus.OK);
        } else {
           /* return new ModelAndView("error").addObject("errorMessage", "Bạn không có quyền truy cập.");*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/edit/{id}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> updateProfileHe(@PathVariable String id,
                                             @RequestParam("firstName") String firstName,
                                             @RequestParam("lastName") String lastName,
                                             @RequestParam("birthDay") String birthDay,
                                             @RequestParam("phone") String phone,
                                             @RequestParam("gender") boolean gender,
                                             @RequestParam("address") String address,
                                             @RequestParam(value = "status", required = false, defaultValue = "true") boolean status,
                                             @RequestHeader("Authorization") String authorizationHeader,
                                             HttpServletRequest request) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Person existPerson = personRepository.findById(id).orElse(null);

            if (existPerson != null) {
                existPerson.setFirstName(firstName);
                existPerson.setLastName(lastName);
                existPerson.setBirthDay(birthDay);
                existPerson.setPhone(phone);
                existPerson.setGender(gender);
                existPerson.setAddress(address);
                existPerson.setStatus(status);

                personRepository.save(existPerson);
                return new ResponseEntity<>(existPerson, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
