package com.web.controller.Student;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.dto.request.PersonRequest;
import com.web.entity.Lecturer;
import com.web.entity.Person;
import com.web.entity.Student;
import com.web.entity.Subject;
import com.web.repository.LecturerRepository;
import com.web.repository.PersonRepository;
import com.web.repository.StudentRepository;
import com.web.utils.Contains;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/student")
public class HomeStudentController {
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private LecturerRepository lecturerRepository;

    private final TokenUtils tokenUtils;
    @Autowired
    public HomeStudentController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }
    @GetMapping("/home")
    public ResponseEntity<?> getListSubject(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            /*ModelAndView modelAndView = new ModelAndView("Dashboard_SinhVien");
            modelAndView.addObject("person", personCurrent);
            return modelAndView;*/
            return new ResponseEntity<>(personCurrent, HttpStatus.OK);
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/listLecturer")
    public ResponseEntity<Map<String,Object>> getListLecturer(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            List<Lecturer> listLecturer = lecturerRepository.findAllLec();
            /*ModelAndView modelAndView = new ModelAndView("student_listLecturer");
            modelAndView.addObject("listLecturer", listLecturer);
            modelAndView.addObject("person",personCurrent);
            return modelAndView;*/
            Map<String,Object> response = new HashMap<>();
            response.put("person",personCurrent);
            response.put("listLecturer",listLecturer);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent != null && personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            Student currentStudent = studentRepository.findById(personCurrent.getPersonId()).orElse(null);
            /*ModelAndView modelAndView = new ModelAndView("profileSV");
            modelAndView.addObject("person", personCurrent);
            return modelAndView;*/
            return new ResponseEntity<>(personCurrent, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            //return new ModelAndView("error").addObject("errorMessage", "Bạn không có quyền truy cập.");
        }
    }

    @GetMapping("/edit")
    public ResponseEntity<?> getEditProfile(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent != null && personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            Person person = personRepository.findById(personCurrent.getPersonId()).orElse(null);
            return new ResponseEntity<>(person,HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable String id,
                                            @RequestParam("firstName") String firstName,
                                            @RequestParam("lastName") String lastName,
                                            @RequestParam("birthDay") String birthDay,
                                            @RequestParam("phone") String phone,
                                            @RequestParam("gender") boolean gender,
                                            @RequestParam(value = "status", required = false, defaultValue = "true") boolean status,
                                            @RequestHeader("Authorization") String authorizationHeader,
                                            HttpServletRequest request) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            Person existPerson = personRepository.findById(id).orElse(null);

            if (existPerson != null) {
                existPerson.setFirstName(firstName);
                existPerson.setLastName(lastName);

                // Attempt to parse the birthDay string using multiple formats
                String[] possibleFormats = {"dd-MM-yyyy", "yyyy-MM-dd", "MM-dd-yyyy"};
                SimpleDateFormat inputFormat = new SimpleDateFormat();
                Date birthDayDate = null;
                for (String format : possibleFormats) {
                    inputFormat.applyPattern(format);
                    try {
                        birthDayDate = inputFormat.parse(birthDay);
                        break; // If parsing succeeds, exit the loop
                    } catch (ParseException e) {
                        // Parsing failed, try next format
                    }
                }

                if (birthDayDate == null) {
                    // Parsing failed for all formats, return an error response
                    return new ResponseEntity<>("Invalid birthDay format", HttpStatus.BAD_REQUEST);
                }
                existPerson.setBirthDay(String.valueOf(birthDayDate));
                existPerson.setPhone(phone);
                existPerson.setGender(gender);
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
