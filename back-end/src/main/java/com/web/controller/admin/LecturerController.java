package com.web.controller.admin;

/*import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;*/
import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.dto.request.StudentRequest;
import com.web.entity.*;
import com.web.mapper.LecturerMapper;
import com.web.dto.request.LecturerRequest;
import com.web.dto.request.PersonRequest;
import com.web.repository.AuthorityRepository;
import com.web.repository.LecturerRepository;
import com.web.repository.PersonRepository;
import com.web.service.Admin.LecturerService;
import com.web.service.Admin.PersonService;
import com.web.utils.Contains;
import com.web.utils.UserUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
@RequestMapping("api/admin/lecturer")
public class LecturerController {
    private static final Logger logger = LoggerFactory.getLogger(LecturerController.class);

    @Autowired
    private LecturerService lecturerService;

    @Autowired
    private LecturerMapper lecturerMapper;

    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private PersonService personService;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private AuthorityRepository authorityRepository;
    private final TokenUtils tokenUtils;
    @Autowired
    public LecturerController(TokenUtils tokenUtils) {
        this.tokenUtils = tokenUtils;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllLecturer(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            List<Authority> listAutho = authorityRepository.findAll();
            ModelAndView modelAndView = new ModelAndView("QuanLyGV");
            List<Lecturer> lecturerList = lecturerService.getAllLec();
            Map<String, Object> response = new HashMap<>();
            response.put("listLecturer",lecturerList);
            response.put("major",Major.values());
            response.put("authors",listAutho);
            response.put("person",personCurrent);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createLecturerAndPerson(@RequestParam(value = "personId", required = true) String personId,
                                                     @RequestParam(value = "firstName", required = true) String firstName,
                                                     @RequestParam(value = "lastName", required = true) String lastName,
                                                     @RequestParam(value = "email", required = true) String email,
                                                     @RequestParam(value = "gender", required = true) boolean gender,
                                                     @RequestParam(value = "birthDay", required = true) String birthDay,
                                                     @RequestParam(value = "phone", required = true) String phone,
                                                     @RequestParam(value = "address", required = true) String address,
                                                     @RequestParam(value = "major", required = true) Major major,
                                                     @RequestParam(value = "author") Authority author,
                                                     @RequestHeader("Authorization") String authorizationHeader) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            /*if (CheckedPermission.isAdmin(personRepository)) {
                //Tạo person*/
            Person newPerson = new Person();
            newPerson.setPersonId(personId);
            newPerson.setFirstName(firstName);
            newPerson.setLastName(lastName);
            newPerson.setUsername(email);
            newPerson.setGender(gender);
            newPerson.setBirthDay(birthDay);
            newPerson.setPhone(phone);
            newPerson.setAddress(address);
            newPerson.setAuthorities(author);
            newPerson.setStatus(true);
            //newPerson.setRole(RoleName.valueOf("Student"));
            var person = personRepository.save(newPerson);
            System.out.println(person.getPersonId());
            System.out.println(newPerson.getPersonId() + " " + newPerson.getLastName());
            LecturerRequest lecturerRequest = new LecturerRequest();
            lecturerRequest.setLecturerId(personId);
            lecturerRequest.setPerson(person);
            lecturerRequest.setAuthority(author);
            lecturerRequest.setMajor(String.valueOf(major));
            lecturerService.saveLecturer(lecturerRequest);
            return new ResponseEntity<>(person,HttpStatus.CREATED);

        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<Map<String,Object>> editStudent(@PathVariable String id,
                                                          @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            Lecturer existLecturer = lecturerRepository.findById(id).orElse(null);
            if (existLecturer!=null){
                Person person = personRepository.findById(existLecturer.getLecturerId()).orElse(null);

                List<Authority> listAutho = authorityRepository.findAll();
                Map<String, Object> response = new HashMap<>();
                response.put("person", person);
                response.put("major",Major.values());
                response.put("lecturer", existLecturer);
                response.put("autho",listAutho);
                return new ResponseEntity<>(response,HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    @PostMapping("/edit/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id,
                                        @RequestParam("personId") String personId,
                                        @RequestParam("firstName") String firstName,
                                        @RequestParam("lastName") String lastName,
                                        @RequestParam("birthDay") String birthDay, // Thay đổi kiểu dữ liệu thành String
                                        @RequestParam("phone") String phone,
                                        @RequestParam("gender") boolean gender,
                                        @RequestParam("authority") String authority,
                                        @RequestParam("username") String username,
                                        @RequestParam("major") String major,
                                        @RequestParam("address") String address,
                                        @RequestParam(value = "status", required = false, defaultValue = "true") boolean status,
                                        @RequestHeader("Authorization") String authorizationHeader) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            Lecturer existLecturer = lecturerRepository.findById(id).orElse(null);
            if (existLecturer != null) {
                existLecturer.setLecturerId(personId);
                existLecturer.getPerson().setFirstName(firstName);
                existLecturer.getPerson().setLastName(lastName);

                existLecturer.getPerson().setBirthDay(birthDay);

                existLecturer.getPerson().setPhone(phone);
                existLecturer.getPerson().setGender(gender);
                Authority authority1 = authorityRepository.findByName(authority);
                existLecturer.setAuthority(authority1);
                existLecturer.getPerson().setAuthorities(authority1);
                existLecturer.setMajor(Major.valueOf(major));
                existLecturer.getPerson().setUsername(username);
                existLecturer.getPerson().setAddress(address);
                Person lecturerPerson = personRepository.findById(existLecturer.getLecturerId()).orElse(null);
                assert lecturerPerson != null;
                lecturerPerson.setAuthorities(authority1);
                existLecturer.getPerson().setStatus(status);
                lecturerRepository.save(existLecturer);
                personRepository.save(lecturerPerson);
                return new ResponseEntity<>(existLecturer, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable String id,@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            Person editPerson = personRepository.findById(id).orElse(null);
            if (editPerson!=null) {
                editPerson.setStatus(false);
                personRepository.save(editPerson);
                /*String referer = request.getHeader("Referer");
                // Thực hiện redirect trở lại trang trước đó
                return new ModelAndView("redirect:" + referer);*/
                return new ResponseEntity<>(HttpStatus.OK);
            }else {
                /*ModelAndView error = new ModelAndView();
                error.addObject("errorMessage", "Không tìm thấy student");
                return error;*/
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            /*odelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

}