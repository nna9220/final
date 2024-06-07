package com.web.controller.HeadOfDepartment.Graduation;

import com.web.entity.TypeSubject;
import com.web.repository.SubjectRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Council.EvaluationAndScoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/head/council/graduation")
@RequiredArgsConstructor
public class HeadEvaluationAndScoringGraduationController {
    @Autowired
    private EvaluationAndScoringService evaluationAndScoringService;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private SubjectRepository subjectRepository;

    @GetMapping("/listSubject")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> getListCouncilOfLecturer(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            return new ResponseEntity<>(evaluationAndScoringService.getListCouncilOfLecturer(authorizationHeader,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/detail/{id}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> detailCouncil(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(evaluationAndScoringService.detailCouncil(authorizationHeader,id),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }


    @PostMapping("/review-score/{id}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> evaluationAndScoringGraduation(@PathVariable int id,@RequestHeader("Authorization") String authorizationHeader,
                                                            @RequestParam("studentId1") String studentId1,
                                                            @RequestParam(value = "studentId2", required = false) String studentId2,
                                                            @RequestParam(value = "studentId3", required = false) String studentId3,
                                                            @RequestParam("scoreStudent1") Double score1,
                                                            @RequestParam(value = "scoreStudent2",required = false) Double score2,
                                                            @RequestParam(value = "scoreStudent3",required = false) Double score3,
                                                            @RequestParam("reviewStudent1") String review1,
                                                            @RequestParam(value = "reviewStudent2",required = false) String review2,
                                                            @RequestParam(value = "reviewStudent3", required = false) String review3){
        try {
            return new ResponseEntity<>(evaluationAndScoringService.evaluationAndScoringGraduation(authorizationHeader,id,studentId1,studentId2,studentId3,review1,review2,review3,score1,score2,score3),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

}
