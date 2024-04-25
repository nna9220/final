package com.web.controller.HeadOfDepartment;

import com.web.config.CheckRole;
import com.web.config.JwtUtils;
import com.web.config.TokenUtils;
import com.web.dto.request.PersonRequest;
import com.web.entity.Lecturer;
import com.web.entity.Person;
import com.web.entity.Subject;
import com.web.entity.TypeSubject;
import com.web.repository.LecturerRepository;
import com.web.repository.PersonRepository;
import com.web.repository.SubjectRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Admin.PersonService;
import com.web.utils.Contains;
import com.web.utils.UserUtils;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
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
    public ResponseEntity<Map<String,Object>> getDetailCounterArgument(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent != null && personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer currentLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject existSubject = subjectRepository.findById(id).orElse(null);
            /*ModelAndView modelAndView = new ModelAndView("head_editReviewTopic");
            modelAndView.addObject("person", personCurrent);
            modelAndView.addObject("lec", currentLecturer);
            modelAndView.addObject("subject",existSubject);
            return modelAndView;*/
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
    public ResponseEntity<?> addScore(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader, @RequestParam Double score){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject existSubject = subjectRepository.findById(id).orElse(null);
            if (existSubject!=null){
                existSubject.setScoreThesis(score);
                subjectRepository.save(existSubject);
                /*String referer = Contains.URL_LOCAL + "/api/head/counterArgumentSubject/detail/" + existSubject.getSubjectId();
                System.out.println("Url: " + referer);
                // Thực hiện redirect trở lại trang trước đó
                return new ModelAndView("redirect:" + referer);*/
                return new ResponseEntity<>(existSubject,HttpStatus.OK);

            }else {
                /*ModelAndView error = new ModelAndView();
                error.addObject("errorMessage", "Không tìm thấy sinh viên");
                return error;*/
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/counterArgumentSubject")
    public ResponseEntity<Map<String,Object>> getCounterArgument(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent != null && personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer currentLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            List<Subject> listSubject = subjectRepository.findSubjectsByThesisAdvisorId(currentLecturer,typeSubject);
            /*ModelAndView modelAndView = new ModelAndView("head_listReviewTopic");
            modelAndView.addObject("person", personCurrent);
            modelAndView.addObject("lec", currentLecturer);
            modelAndView.addObject("listSubject",listSubject);
            return modelAndView;*/
            Map<String,Object> response = new HashMap<>();
            response.put("person", personCurrent);
            response.put("lec",currentLecturer);
            response.put("listSubject", listSubject);
            return new ResponseEntity<>(response,HttpStatus.OK);
        } else {
           /* return new ModelAndView("error").addObject("errorMessage", "Bạn không có quyền truy cập.");*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/home")
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
    public ResponseEntity<?> getEditProfile(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent != null && personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Person person = personRepository.findById(personCurrent.getPersonId()).orElse(null);
            /*ModelAndView modelAndView = new ModelAndView("profileTBM");
            modelAndView.addObject("person", person);
            return modelAndView;*/
            return new ResponseEntity<>(person,HttpStatus.OK);
        } else {
           /* return new ModelAndView("error").addObject("errorMessage", "Bạn không có quyền truy cập.");*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<?> updateHead(@PathVariable String id,
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
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
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
