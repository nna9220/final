package com.web.controller.HeadOfDepartment.Graduation;

import com.web.entity.ReviewByInstructor;
import com.web.entity.ReviewByThesis;
import com.web.entity.Subject;
import com.web.entity.TypeSubject;
import com.web.repository.ReviewByInstructorRepository;
import com.web.repository.ReviewByThesisRepository;
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
@RequestMapping("/api/head/council/graduation")
@RequiredArgsConstructor
public class HeadEvaluationAndScoringGraduationController {
    @Autowired
    private EvaluationAndScoringService evaluationAndScoringService;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private ReviewByInstructorRepository reviewByInstructorRepository;
    @Autowired
    private ReviewByThesisRepository reviewByThesisRepository;
    @Autowired
    private ManageTutorialSubjectService manageTutorialSubjectService;

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
                                                            @RequestParam(value = "reviewStudent3", required = false) String review3,
                                                            @RequestParam(value = "editSuggestions", required = false) String editSuggestion){
        try {
            return new ResponseEntity<>(evaluationAndScoringService.evaluationAndScoringGraduation(authorizationHeader,id,studentId1,studentId2,studentId3,review1,review2,review3,score1,score2,score3,editSuggestion),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/reviewInstructor/{subjectId}")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> getDetailReviewInstructor(@PathVariable int subjectId,@RequestHeader("Authorization") String authorizationHeader){
        try {
            Subject existedSubject = subjectRepository.findById(subjectId).orElse(null);
            if (existedSubject!=null){
                ReviewByInstructor existedReview = reviewByInstructorRepository.getReviewByInstructorBySAndSubject(existedSubject);
                if (existedReview!=null){
                    return new ResponseEntity<>(existedReview,HttpStatus.OK);
                }else {
                    //K tìm thấy đánh giá
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            }else {
                //Không tìm thấy đề tài
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/listCriteria")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> getListCriteria(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            return new ResponseEntity<>(manageTutorialSubjectService.getListCriteria(authorizationHeader,typeSubject),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/reviewThesis{subjectId}")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> getDetailReviewThesis(@PathVariable int subjectId,@RequestHeader("Authorization") String authorizationHeader){
        try {
            Subject existedSubject = subjectRepository.findById(subjectId).orElse(null);
            if (existedSubject!=null){
                ReviewByThesis existedReview = reviewByThesisRepository.getReviewByThesisBySAndSubject(existedSubject);
                if (existedReview!=null){
                    return new ResponseEntity<>(existedReview,HttpStatus.OK);
                }else {
                    //K tìm thấy đánh giá
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            }else {
                //Không tìm thấy đề tài
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

}
