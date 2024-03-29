package com.web.controller.admin;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;
import com.web.config.CheckRole;
import com.web.config.JwtUtils;
import com.web.dto.response.StudentClassResponse;
import com.web.dto.response.SubjectResponse;
import com.web.entity.*;
import com.web.mapper.SubjectMapper;
import com.web.repository.PersonRepository;
import com.web.service.Admin.SubjectService;
import com.web.utils.UserUtils;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping("/api/admin/subject")
public class SubjectController {
    @Autowired
    private SubjectService subjectService;
    @Autowired
    private SubjectMapper subjectMapper;
    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private UserUtils userUtils;
    @GetMapping
    public ModelAndView getAllSubject(HttpSession session){
        Person personCurrent = CheckRole.getRoleCurrent(session,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            List<Subject> subjects = subjectService.getAll();
            ModelAndView modelAndView = new ModelAndView("QuanLyDeTai_Admin");
            modelAndView.addObject("person", personCurrent);
            modelAndView.addObject("subjects",subjects);
            return modelAndView;
        }else {
            ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;
        }
    }
    //Duyệt đề tài
    @PutMapping("/browse/{id}")
    public ResponseEntity<?> browseSubjectExisted(@PathVariable int id){
       /* if (CheckedPermission.isAdmin(personRepository)){*/
            return ResponseEntity.ok(subjectService.browseSubject(id));
        /*}else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }*/
    }
}
