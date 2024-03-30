package com.web.controller.admin;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;
import com.web.config.CheckRole;
import com.web.config.JwtUtils;
import com.web.dto.response.StudentClassResponse;
import com.web.dto.response.SubjectResponse;
import com.web.entity.*;
import com.web.mapper.SubjectMapper;
import com.web.repository.PersonRepository;
import com.web.service.Admin.SubjectImport;
import com.web.service.Admin.SubjectService;
import com.web.utils.UserUtils;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.io.IOException;
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
    private SubjectImport subjectImport;

    @Autowired
    private UserUtils userUtils;
    @GetMapping
    public ResponseEntity<?> getAllSubject(HttpSession session){

        List<Subject> subjects = subjectService.getAll();
        return new ResponseEntity<>(subjects,HttpStatus.OK);
    }

    //Import subject


    @PostMapping("/import")
    public ResponseEntity<?> importSubject(@RequestParam("file") MultipartFile file, HttpSession session) throws IOException {
        subjectImport.importSubject(file);
        return new ResponseEntity<>(subjectImport.importSubject(file),HttpStatus.OK);
    }



}
