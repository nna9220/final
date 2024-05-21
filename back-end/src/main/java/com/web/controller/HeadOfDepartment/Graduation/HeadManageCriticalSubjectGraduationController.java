package com.web.controller.HeadOfDepartment.Graduation;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.Person;
import com.web.entity.TimeBrowsOfHead;
import com.web.entity.TypeSubject;
import com.web.repository.PersonRepository;
import com.web.repository.SubjectRepository;
import com.web.repository.TimeBrowseHeadRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.utils.UserUtils;
import com.web.service.Lecturer.ThesisBrowseSubjectToCouncil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/head/manageCritical/graduation")
public class HeadManageCriticalSubjectGraduationController {
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TimeBrowseHeadRepository timeBrowseHeadRepository;
    private final TokenUtils tokenUtils;
    @Autowired
    public HeadManageCriticalSubjectGraduationController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }

    private ThesisBrowseSubjectToCouncil thesisBrowseSubjectToCouncil;

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

    @GetMapping("/timeBrowse")
    public ResponseEntity<Map<String,Object>> findAllExisted(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            List<TimeBrowsOfHead> timeBrowsOfHeads = timeBrowseHeadRepository.findAllPeriodEssay(typeSubject);
            //List<TimeBrowsOfHead> timeBrowsOfHeads = timeBrowseHeadRepository.findAll();
            List<TypeSubject> typeSubjects = typeSubjectRepository.findAll();
            Map<String,Object> response = new HashMap<>();
            response.put("timeBrowse",timeBrowsOfHeads);
            response.put("person",personCurrent);
            response.put("listTypeSubject", typeSubjects);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
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
