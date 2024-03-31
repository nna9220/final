package com.web.controller.admin;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;
import com.web.config.CheckRole;
import com.web.config.JwtUtils;
import com.web.dto.response.StudentClassResponse;
import com.web.dto.response.SubjectResponse;
import com.web.entity.*;
import com.web.mapper.SubjectMapper;
import com.web.repository.PersonRepository;
import com.web.repository.SubjectRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Admin.SubjectImportKLTN;
import com.web.service.Admin.SubjectImportTLCN;
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
    private SubjectRepository subjectRepository;

    @Autowired
    private SubjectImportTLCN subjectImport;
    @Autowired
    private SubjectImportKLTN subjectImportKLTN;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;

    @Autowired
    private UserUtils userUtils;
    @GetMapping("/tlcn")
    public ResponseEntity<?> getAllSubject(HttpSession session){
        TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
        List<Subject> subjects = subjectRepository.findSubjectByType(typeSubject);
        return new ResponseEntity<>(subjects,HttpStatus.OK);
    }

    @GetMapping("/kltn")
    public ResponseEntity<?> getAllSubjectKLTN(HttpSession session){
        TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
        List<Subject> subjects = subjectRepository.findSubjectByType(typeSubject);
        return new ResponseEntity<>(subjects,HttpStatus.OK);
    }



    //Import subject


    @PostMapping("/importTLCN")
    public ResponseEntity<?> importSubject(@RequestParam("file") MultipartFile file) throws IOException {
        return new ResponseEntity<>(subjectImport.importSubject(file),HttpStatus.OK);
    }

    @PostMapping("/importKLTN")
    public ResponseEntity<?> importSubjectKLTN(@RequestParam("file") MultipartFile file) throws IOException {
        return new ResponseEntity<>(subjectImportKLTN.importSubject(file),HttpStatus.OK);
    }


}
