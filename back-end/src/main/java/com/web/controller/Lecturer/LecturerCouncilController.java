package com.web.controller.Lecturer;

import com.web.entity.TypeSubject;
import com.web.repository.SubjectRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Council.EvaluationAndScoringService;
import com.web.service.Lecturer.ManageTutorialSubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lecturer/council")
@RequiredArgsConstructor
public class LecturerCouncilController {
    @Autowired
    private EvaluationAndScoringService evaluationAndScoringService;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private ManageTutorialSubjectService manageTutorialSubjectService;
    @GetMapping("/listCouncil")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> getListCouncilOfLecturer(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            return new ResponseEntity<>(evaluationAndScoringService.getListCouncilOfLecturerGraduation(authorizationHeader,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/detail/{id}")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> detailCouncil(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(evaluationAndScoringService.detailCouncil(authorizationHeader,id),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/listCriteria")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> getListCriteria(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            return new ResponseEntity<>(manageTutorialSubjectService.getListCriteria(authorizationHeader,typeSubject),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }
    @PostMapping("/evaluation-scoring/{id}")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> evaluationAndScoring(@PathVariable int id,
                                                  @RequestHeader("Authorization") String authorizationHeader,
                                                  @RequestParam("studentId1") String studentId1,
                                                  @RequestParam(value = "studentId2", required = false) String studentId2,
                                                  @RequestParam(value = "studentId3", required = false) String studentId3,
                                                  @RequestParam("scoreStudent1") Double score1,
                                                  @RequestParam(value = "scoreStudent2", required = false) Double score2,
                                                  @RequestParam(value = "scoreStudent3", required = false) Double score3,
                                                  @RequestParam("reviewStudent1") String review1,
                                                  @RequestParam(value = "reviewStudent2", required = false) String review2,
                                                  @RequestParam(value = "reviewStudent3", required = false) String review3) {
        try {
            // Add detailed logging
            System.out.println("Received evaluation request for council ID: " + id);
            System.out.println("Authorization header: " + authorizationHeader);
            System.out.println("Student IDs: " + studentId1 + ", " + studentId2 + ", " + studentId3);
            System.out.println("Scores: " + score1 + ", " + score2 + ", " + score3);
            System.out.println("Reviews: " + review1 + ", " + review2 + ", " + review3);

            // Ensure no null values are passed to the service layer
            return new ResponseEntity<>(evaluationAndScoringService.evaluationAndScoringEssay(
                    authorizationHeader, id, studentId1, studentId2, studentId3, review1, review2, review3, score1, score2, score3), HttpStatus.OK);
        } catch (Exception e) {
            // Log the exception details
            System.err.println("Error during evaluation and scoring: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Internal Server Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
