package com.web.controller.admin;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;
import com.web.config.CheckRole;
import com.web.config.JwtUtils;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.exception.NotFoundException;
import com.web.mapper.StudentClassMapper;
import com.web.dto.request.StudentClassRequest;
import com.web.repository.PersonRepository;
import com.web.repository.StudentClassRepository;
import com.web.service.Admin.StudentClassService;
import com.web.utils.Contains;
import com.web.utils.UserUtils;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/studentClass")
public class StudentClassController {
    @Autowired
    private StudentClassService studentClassService;
    @Autowired
    private StudentClassMapper studentClassMapper;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private StudentClassRepository studentClassRepository;
    private final TokenUtils tokenUtils;
    @Autowired
    public StudentClassController (TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }
    @GetMapping
    public ResponseEntity<Map<String,Object>> getStudentClass(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person person = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (person.getAuthorities().getName().equals("ROLE_ADMIN")) {
            List<StudentClass> studentClasses = studentClassService.findAll();
            Map<String,Object> response = new HashMap<>();
            response.put("listClass", studentClasses);
            response.put("person", person);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    @PostMapping("/create")
    public ResponseEntity<?> saveClass(@RequestParam("className") String className, HttpServletRequest request, RedirectAttributes redirectAttributes){

        StudentClassRequest studentClass = new StudentClassRequest();
        studentClass.setClassname(className);
        studentClass.setStatus(true);
        studentClassService.createStudentClass(studentClass);

        return new ResponseEntity<>(studentClass,HttpStatus.CREATED);
    }

    @GetMapping("/{classId}")
    public ResponseEntity<Map<String,Object>> editClass(HttpSession session,@PathVariable int classId) {
        // Lấy thông tin lớp học cần chỉnh sửa từ service
        StudentClass studentClass = studentClassService.getStudentClassById(classId);
        Person personCurrent = CheckRole.getRoleCurrent(session,userUtils,personRepository);

        // Kiểm tra xem lớp học có tồn tại không
        if (studentClass != null) {
            // Trả về ModelAndView với thông tin lớp học và đường dẫn của trang chỉnh sửa
            /*ModelAndView model = new ModelAndView("admin_editClass");
            model.addObject("studentClass", studentClass);
            model.addObject("person", personCurrent);

            return model;*/
            Map<String,Object> response = new HashMap<>();
            response.put("person", personCurrent);
            response.put("studentClass",studentClass);
            return new ResponseEntity<>(response,HttpStatus.OK);
        } else {
            // Trả về ModelAndView với thông báo lỗi nếu không tìm thấy lớp học
            /*ModelAndView errorModel = new ModelAndView("error");
            errorModel.addObject("errorMessage", "Không tìm thấy lớp học");
            return errorModel;*/
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
   @PostMapping("/edit/{classId}")
    public ResponseEntity<?> updateStudentClass(@PathVariable int classId, @ModelAttribute StudentClassRequest studentClass, @ModelAttribute("successMessage") String successMessage){
        StudentClass existStudentClass = studentClassService.getStudentClassById(classId);
       /*if (CheckedPermission.isAdmin(personRepository)){*/
           if (existStudentClass != null){
               existStudentClass.setClassname(studentClass.getClassname());
               existStudentClass.setStatus(true);
               studentClassRepository.save(existStudentClass);
               return new ResponseEntity<>(existStudentClass,HttpStatus.OK);
           }else {
               return new ResponseEntity<>(HttpStatus.NOT_FOUND);
           }
       /*}else {
           return new ResponseEntity<>(HttpStatus.FORBIDDEN);
       }*/
    }



}
