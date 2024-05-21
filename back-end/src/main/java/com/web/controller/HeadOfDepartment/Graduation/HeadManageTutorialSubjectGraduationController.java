package com.web.controller.HeadOfDepartment.Graduation;

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
@RequestMapping("/api/head/manageTutorial/graduation")
public class HeadManageTutorialSubjectGraduationController {
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
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
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
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            return new ResponseEntity<>(manageTutorialSubjectService.NoticeOfOneHundredReportSubmissionToListSubject(authorizationHeader,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/listCriteria")
    public ResponseEntity<?> getListCriteria(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            return new ResponseEntity<>(manageTutorialSubjectService.getListCriteria(authorizationHeader,typeSubject),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/browse/{subjectId}")
    public ResponseEntity<?> browseToThesisAndScoreOfInstructor(@PathVariable int subjectId,
                                                                @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(manageTutorialSubjectService.BrowseMoveToThesisAdvisorGraduation(subjectId,authorizationHeader),HttpStatus.OK);
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

    //Danh sách đề tài hướng dẫn đã hoàn thành (hội đồng đã chấm điểm)
    @GetMapping("/subjects/successful")
    public ResponseEntity<?> getListSubjectSuccessful(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            return new ResponseEntity<>(manageTutorialSubjectService.getListSubjectSuccessful(authorizationHeader,typeSubject),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }

    }

    //Detail
    @GetMapping("/subjects/successful/detail/{id}")
    public ResponseEntity<?> getDetailSubjectSuccessful(@PathVariable int id,@RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(manageTutorialSubjectService.getDetailSubjectSuccessful(id,authorizationHeader),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }

    }



}
