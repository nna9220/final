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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
            Student currentStudent = studentRepository.findById(personCurrent.getPersonId()).orElse(null);
            /*ModelAndView modelAndView = new ModelAndView("profileSV");
            modelAndView.addObject("person", personCurrent);
            return modelAndView;*/
            return new ResponseEntity<>(currentStudent, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            //return new ModelAndView("error").addObject("errorMessage", "Bạn không có quyền truy cập.");
        }
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable String id,@ModelAttribute PersonRequest studentRequest,
                                      @RequestHeader("Authorization") String authorizationHeader, HttpServletRequest request){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            Student existStudent = studentRepository.findById(id).orElse(null);
            if (existStudent!=null){
                System.out.println(id);
                existStudent.getPerson().setFirstName(studentRequest.getFirstName());
                existStudent.getPerson().setLastName(studentRequest.getLastName());
                existStudent.getPerson().setBirthDay(String.valueOf(studentRequest.getBirthDay()));
                existStudent.getPerson().setPhone(studentRequest.getPhone());
                existStudent.getPerson().setStatus(studentRequest.isStatus());
                studentRepository.save(existStudent);
                /*String referer = Contains.URL_LOCAL + "/api/student/profile";
                System.out.println("Url: " + referer);
                // Thực hiện redirect trở lại trang trước đó
                return new ModelAndView("redirect:" + referer);*/
                return new ResponseEntity<>(existStudent, HttpStatus.OK);

            }else {
               /* ModelAndView error = new ModelAndView();
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

}
