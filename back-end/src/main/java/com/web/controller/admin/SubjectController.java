package com.web.controller.admin;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;
import com.web.config.CheckRole;
import com.web.config.JwtUtils;
import com.web.config.TokenUtils;
import com.web.dto.response.StudentClassResponse;
import com.web.dto.response.SubjectResponse;
import com.web.entity.*;
import com.web.mapper.SubjectMapper;
import com.web.repository.LecturerRepository;
import com.web.repository.PersonRepository;
import com.web.repository.SubjectRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Admin.SubjectImportKLTN;
import com.web.service.Admin.SubjectImportTLCN;
import com.web.service.Admin.SubjectService;
import com.web.utils.UserUtils;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/subject")
@RequiredArgsConstructor
public class SubjectController {
    @Autowired
    private SubjectService subjectService;
    @Autowired
    private SubjectMapper subjectMapper;
    private final TokenUtils tokenUtils;
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
    private LecturerRepository lecturerRepository;

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


    //Add GVPB
    @PostMapping("/addCounterArgumrnt/{subjectId}/{lecturerId}")
    public ResponseEntity<?> addCounterArgumrnt(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader, @PathVariable String lecturerId){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            Subject existedSubject = subjectRepository.findById(subjectId).orElse(null);
            if (existedSubject != null) {
                Lecturer currentLecturer = lecturerRepository.findById(lecturerId).orElse(null);
                List<Subject> addSub = new ArrayList<>();
                addSub.add(existedSubject);
                if (currentLecturer != null) {
                    existedSubject.setThesisAdvisorId(currentLecturer);
                    lecturerRepository.save(currentLecturer);
                    subjectRepository.save(existedSubject);
                }
            }
            return new ResponseEntity<>(existedSubject, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //Add GVHD
    @PostMapping("/addInstructor/{subjectId}/{lecturerId}")
    public ResponseEntity<?> addIntructor(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader, @PathVariable String lecturerId){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            Subject existedSubject = subjectRepository.findById(subjectId).orElse(null);
            if (existedSubject != null) {
                Lecturer currentLecturer = lecturerRepository.findById(lecturerId).orElse(null);
                List<Subject> addSub = new ArrayList<>();
                addSub.add(existedSubject);
                if (currentLecturer != null) {
                    existedSubject.setInstructorId(currentLecturer);
                    lecturerRepository.save(currentLecturer);
                    subjectRepository.save(existedSubject);
                }
            }
            return new ResponseEntity<>(existedSubject, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/listLecturer/{subjectId}")
    public ResponseEntity<Map<String,Object>> getAddCounterArgument(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            Subject currentSubject = subjectRepository.findById(subjectId).orElse(null);
            if (currentSubject != null) {
                List<Lecturer> lecturerList = lecturerRepository.findAll(); // Lấy tất cả giảng viên
                Map<String,Object> response = new HashMap<>();
                response.put("listLecturer", lecturerList);
                response.put("person",personCurrent);
                response.put("subject", currentSubject);
                return new ResponseEntity<>(response,HttpStatus.OK);
            } else {
                return null;
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
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
