package com.web.controller.HeadOfDepartment;

import com.web.config.TokenUtils;
import com.web.entity.Student;
import com.web.entity.TypeSubject;
import com.web.repository.LecturerRepository;
import com.web.repository.SubjectRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Lecturer.ManageTutorialSubjectService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/head/manageTutorial")
public class HeadManageTutorialSubjectController {
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private ManageTutorialSubjectService manageTutorialSubjectService;

    @PostMapping("/fiftyRecent/{subjectId}")
    public ResponseEntity<?> NoticeOfFiftyReportSubmission(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(manageTutorialSubjectService.NoticeOfFiftyReportSubmission(subjectId,authorizationHeader), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/fiftyRecent/listSubject")
    public ResponseEntity<?> NoticeOfFiftyReportSubmissionToListSubject(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            return new ResponseEntity<>(manageTutorialSubjectService.NoticeOfFiftyReportSubmissionToListSubject(authorizationHeader,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/OneHundredRecent/{subjectId}")
    public ResponseEntity<?> NoticeOfOneHundredReportSubmission(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(manageTutorialSubjectService.NoticeOfOneHundredReportSubmission(subjectId,authorizationHeader), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/OneHundredRecent/listSubject")
    public ResponseEntity<?> NoticeOfOneHundredReportSubmissionToListSubject(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            return new ResponseEntity<>(manageTutorialSubjectService.NoticeOfOneHundredReportSubmissionToListSubject(authorizationHeader,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/listCriteria")
    public ResponseEntity<?> getListCriteria(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            return new ResponseEntity<>(manageTutorialSubjectService.getListCriteria(authorizationHeader,typeSubject),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/browse-score/{subjectId}")
    public ResponseEntity<?> browseToThesisAndScoreOfInstructor(@PathVariable int subjectId,
                                                                @RequestParam("review") String review,
                                                                @RequestParam("score") Double score,
                                                                @RequestParam("studentId") Student studentId,
                                                                @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(manageTutorialSubjectService.BrowseMoveToThesisAdvisorEssay(subjectId,authorizationHeader,review,score,studentId),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }

    }

    @PostMapping("/refuse/{subjectId}")
    public ResponseEntity<?> RefuseSubject(@PathVariable int subjectId,
                                           @RequestHeader("Authorization") String authorizationHeader,
                                           @RequestParam("reason") String reason){
        try {
            return new ResponseEntity<>(manageTutorialSubjectService.RefuseTheSubject(subjectId,authorizationHeader,reason),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }

    }


}
