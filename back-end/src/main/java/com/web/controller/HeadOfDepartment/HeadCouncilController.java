package com.web.controller.HeadOfDepartment;

import com.web.entity.TypeSubject;
import com.web.repository.SubjectRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Council.EvaluationAndScoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/head/council")
@RequiredArgsConstructor
public class HeadCouncilController {
    @Autowired
    private EvaluationAndScoringService evaluationAndScoringService;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private SubjectRepository subjectRepository;

    @GetMapping("/listSubject")
    public ResponseEntity<?> getListCouncilOfLecturer(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            return new ResponseEntity<>(evaluationAndScoringService.getListCouncilOfLecturer(authorizationHeader,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detailCouncil(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(evaluationAndScoringService.detailCouncil(authorizationHeader,id),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/evaluation-scoring/{id}")
    public ResponseEntity<?> evaluationAndScoring(@PathVariable int id,@RequestHeader("Authorization") String authorizationHeader,
                                                  @RequestParam("studentId1") String studentId1,
                                                  @RequestParam("studentId2") String studentId2,
                                                  @RequestParam("studentId3") String studentId3,
                                                  @RequestParam("score1Student") Double score1,
                                                  @RequestParam("scoreStudent2") Double score2,
                                                  @RequestParam("scoreStudent3") Double score3,
                                                  @RequestParam("reviewStudent1") String review1,
                                                  @RequestParam("reviewStudent2") String review2,
                                                  @RequestParam("reviewStudent3") String review3){
        try {
            return new ResponseEntity<>(evaluationAndScoringService.evaluationAndScoringEssay(authorizationHeader,id,studentId1,studentId2,studentId3,review1,review2,review3,score1,score2,score3),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }
}
