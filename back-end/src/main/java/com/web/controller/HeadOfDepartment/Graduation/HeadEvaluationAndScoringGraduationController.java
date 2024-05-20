package com.web.controller.HeadOfDepartment.Graduation;

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
    public ResponseEntity<?> detailCouncil(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(evaluationAndScoringService.detailCouncil(authorizationHeader,id),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

}
