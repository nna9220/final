package com.web.controller.HeadOfDepartment.Graduation;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.*;
import com.web.service.HeaderOdDepartment.ManageCouncilService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/head/manager/council")
public class HeadManageCouncilController {
    @Autowired
    private ManageCouncilService manageCouncilService;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private PersonRepository personRepository;
    private final TokenUtils tokenUtils;
    @Autowired
    public HeadManageCouncilController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }
    @GetMapping("/listSubject")
    public ResponseEntity<?> getListSubject(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            return new ResponseEntity<>(manageCouncilService.getListSubject(authorizationHeader,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/listLecturer/{subjectId}")
    public ResponseEntity<Map<String,Object>> getAddCounterArgument(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject currentSubject = subjectRepository.findById(subjectId).orElse(null);
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            List<Lecturer> lecturerList = lecturerRepository.getListLecturerNotInstructorAndThesis(currentSubject.getInstructorId().getLecturerId(),currentSubject.getThesisAdvisorId().getLecturerId());
            Map<String,Object> response = new HashMap<>();
            response.put("listLecturer", lecturerList);
            response.put("person",personCurrent);
            response.put("subject", currentSubject);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/detailCouncil/{subjectId}")
    public ResponseEntity<Map<String,Object>> getDetailCouncil(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject currentSubject = subjectRepository.findById(subjectId).orElse(null);
            Council council = currentSubject.getCouncil();
            System.out.println("detail council: " + council);
            Map<String,Object> response = new HashMap<>();
            response.put("council",council);
            if ((council!=null)) {
                response.put("listLecturerOfCouncil", council.getLecturers());
            }
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/edit/{subjectId}")
    private ResponseEntity<?> editCouncil(@RequestHeader("Authorization") String authorizationHeader,
                                                  @PathVariable int subjectId,
                                          @RequestParam("time") String time,
                                          @RequestParam("address") String address,
                                          @RequestParam("lecturer1")String lecturer1,
                                          @RequestParam("lecturer2")String lecturer2,
                                          @RequestParam(value = "lecturer3",required = false)String lecturer3,
                                          @RequestParam(value = "lecturer4",required = false)String lecturer4){
        System.out.println("Hello");
        try {
            return new ResponseEntity<>(manageCouncilService.updateCouncil(subjectId,authorizationHeader,time,address,lecturer1,lecturer2,lecturer3,lecturer4),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }
}
