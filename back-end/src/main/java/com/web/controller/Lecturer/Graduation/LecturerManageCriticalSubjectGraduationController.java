package com.web.controller.Lecturer.Graduation;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.Lecturer;
import com.web.entity.Person;
import com.web.entity.Subject;
import com.web.entity.TypeSubject;
import com.web.repository.LecturerRepository;
import com.web.repository.PersonRepository;
import com.web.repository.SubjectRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.HeaderOdDepartment.BrowseSubjectToThesisService;
import com.web.service.Lecturer.ThesisBrowseSubjectToCouncil;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lecturer/manageCritical/graduation")
public class LecturerManageCriticalSubjectGraduationController {
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private ThesisBrowseSubjectToCouncil thesisBrowseSubjectToCouncil;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private PersonRepository personRepository;
    private final TokenUtils tokenUtils;
    @Autowired
    public LecturerManageCriticalSubjectGraduationController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }
    @GetMapping("/listSubject")
    public ResponseEntity<?> getListSubject(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            return new ResponseEntity<>(thesisBrowseSubjectToCouncil.getListOfSubjectWasHeadBrowse(authorizationHeader,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/counterArgumentSubject")
    public ResponseEntity<Map<String,Object>> getCounterArgument(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent != null && personCurrent.getAuthorities().getName().equals("ROLE_LECTURER")) {
            Lecturer currentLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            List<Subject> listSubject = subjectRepository.findSubjectsByThesisAdvisorId(currentLecturer,typeSubject);
            Map<String,Object> response = new HashMap<>();
            response.put("person", personCurrent);
            response.put("lec",currentLecturer);
            response.put("listSubject", listSubject);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/counterArgumentSubject/detail/{id}")
    public ResponseEntity<Map<String,Object>> getDetailCounterArgument(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent != null && personCurrent.getAuthorities().getName().equals("ROLE_LECTURER")) {
            Lecturer currentLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject existSubject = subjectRepository.findById(id).orElse(null);
            Map<String,Object> response = new HashMap<>();
            response.put("person",personCurrent);
            response.put("lec",currentLecturer);
            response.put("subject",existSubject);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    //GVPB duyệt đề tài qua cho Hội đồng
    @PostMapping("/accept-subject-to-council/{subjectId}")
    public ResponseEntity<?> CompletedSubjectBrowseToCouncil(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(thesisBrowseSubjectToCouncil.CompletedSubjectBrowseToCouncil(authorizationHeader,subjectId),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }
}
