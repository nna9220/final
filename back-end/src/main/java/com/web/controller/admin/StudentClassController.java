package com.web.controller.admin;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;
import com.web.config.CheckRole;
import com.web.config.JwtUtils;
import com.web.entity.Person;
import com.web.entity.Student;
import com.web.entity.StudentClass;
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

    @GetMapping
    public ResponseEntity<Map<String,Object>> getStudentClass(HttpSession session){
        String token = (String) session.getAttribute("token");
        Claims claims = JwtUtils.extractClaims(token, "f2f1035db6a255e7885838b020f370d702d4bb0f35a368f06ded1ce8e6684a27");
        UserDetails email = userUtils.loadUserByUsername(claims.getSubject());
        Person person = personRepository.findUserByEmail(email.getUsername());
        if (person.getAuthorities().getName().equals("ROLE_ADMIN")){
        List<StudentClass> studentClasses = studentClassService.findAll();
        /*ModelAndView model = new ModelAndView("QuanLyLopHoc");
        model.addObject("listClass", studentClasses);
        model.addObject("person", person);
        return model;*/
            Map<String,Object> response = new HashMap<>();
            response.put("listClass", studentClasses);
            response.put("person", person);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
           /* ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> saveClass(@RequestParam("className") String className, HttpServletRequest request, RedirectAttributes redirectAttributes){

        StudentClassRequest studentClass = new StudentClassRequest();
        studentClass.setClassname(className);
        studentClassService.createStudentClass(studentClass);

        // Lấy URL trước đó từ request
        /*String referer = request.getHeader("Referer");

        // Thực hiện redirect trở lại trang trước đó
        return new ModelAndView("redirect:" + referer);*/
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
               existStudentClass.setStatus(studentClass.isStatus());
               studentClassRepository.save(existStudentClass);
               /*String url = Contains.URL_LOCAL + "/api/admin/studentClass";
               ModelAndView model = new ModelAndView("redirect:" + url);

               model.addObject("successMessage", successMessage);
               return model;*/
               return new ResponseEntity<>(existStudentClass,HttpStatus.OK);
           }else {
               return new ResponseEntity<>(HttpStatus.NOT_FOUND);
           }
       /*}else {
           return new ResponseEntity<>(HttpStatus.FORBIDDEN);
       }*/
    }



}
