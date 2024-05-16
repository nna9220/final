package com.web.controller.Lecturer.Graduation;

import com.web.entity.TypeSubject;
import com.web.repository.SubjectRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Lecturer.ManageCriticalSubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lecturer/manageCritical/graduation")
public class LecturerManageCriticalSubjectGraduationController {
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private ManageCriticalSubjectService manageCriticalSubjectService;

    @GetMapping("/listSubject")
    public ResponseEntity<?> getListSubject(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            return new ResponseEntity<>(manageCriticalSubjectService.getListOfSubjectHaveReportOneHundred(authorizationHeader,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }
    @PostMapping("/accept-subject-to-council/{subjectId}")
    public ResponseEntity<?> CompletedSubjectBrowseToCouncil(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(manageCriticalSubjectService.CompletedSubjectBrowseToCouncil(authorizationHeader,subjectId),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }
}
