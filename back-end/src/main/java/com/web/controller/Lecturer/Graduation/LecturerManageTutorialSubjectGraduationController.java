package com.web.controller.Lecturer.Graduation;

import com.web.config.TokenUtils;
import com.web.entity.TypeSubject;
import com.web.repository.LecturerRepository;
import com.web.repository.SubjectRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Council.EvaluationAndScoringService;
import com.web.service.Lecturer.ManageTutorialSubjectService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lecturer/manageTutorial/graduation")
public class LecturerManageTutorialSubjectGraduationController {
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
    @Autowired
    private EvaluationAndScoringService evaluationAndScoringService;

    @PostMapping("/fiftyRecent/{subjectId}")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> NoticeOfFiftyReportSubmission(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(manageTutorialSubjectService.NoticeOfFiftyReportSubmission(subjectId,authorizationHeader), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/fiftyRecent/listSubject")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
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
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> NoticeOfOneHundredReportSubmission(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(manageTutorialSubjectService.NoticeOfOneHundredReportSubmission(subjectId,authorizationHeader), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/OneHundredRecent/listSubject")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
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
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> getListCriteria(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            return new ResponseEntity<>(manageTutorialSubjectService.getListCriteria(authorizationHeader,typeSubject),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/list-subject")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> getListSubjectHaveReport(@RequestHeader("Authorization") String authorizationHeader){
        try {
            System.out.println("List subject");
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            return new ResponseEntity<>(manageTutorialSubjectService.getListOfSubjectHaveReportOneHundred(authorizationHeader,typeSubject),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    //GVHD duyệt đề tài qua cho TBM
    @PostMapping("/browse/{subjectId}")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
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
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
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

    //GVHD Chấm điểm đề tài khóa liaanj
    @PostMapping("/instructor-addScore-graduation/{id}")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> InstructorScoringGraduation(@PathVariable int id,@RequestHeader("Authorization") String authorizationHeader,
                                                         @RequestParam("studentId1") String studentId1,
                                                         @RequestParam("studentId2") String studentId2,
                                                         @RequestParam("studentId3") String studentId3,
                                                         @RequestParam("score1Student") Double score1,
                                                         @RequestParam("scoreStudent2") Double score2,
                                                         @RequestParam("scoreStudent3") Double score3){
        try {
           return evaluationAndScoringService.InstructorAddScoreGraduation(id,authorizationHeader,score1,score2,score3,studentId1,studentId2,studentId3);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    //Danh sách đề tài hướng dẫn đã hoàn thành (hội đồng đã chấm điểm)
    @GetMapping("/subjects/successful")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
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
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> getDetailSubjectSuccessful(@PathVariable int id,@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            return new ResponseEntity<>(manageTutorialSubjectService.getDetailSubjectSuccessful(id,authorizationHeader,typeSubject),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }

    }

}
