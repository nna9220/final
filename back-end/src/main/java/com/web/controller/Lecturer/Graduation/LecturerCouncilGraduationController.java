package com.web.controller.Lecturer.Graduation;

import com.web.entity.ReviewByInstructor;
import com.web.entity.ReviewByThesis;
import com.web.entity.Subject;
import com.web.entity.TypeSubject;
import com.web.repository.ReviewByInstructorRepository;
import com.web.repository.ReviewByThesisRepository;
import com.web.repository.SubjectRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Council.EvaluationAndScoringService;
import com.web.service.HeaderOdDepartment.WordExportService;
import com.web.service.Lecturer.ManageTutorialSubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/lecturer/council/graduation")
@RequiredArgsConstructor
public class LecturerCouncilGraduationController {
    @Autowired
    private EvaluationAndScoringService evaluationAndScoringService;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private WordExportService wordExportService;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private ManageTutorialSubjectService manageTutorialSubjectService;
    @Autowired
    private ReviewByInstructorRepository reviewByInstructorRepository;
    @Autowired
    private ReviewByThesisRepository reviewByThesisRepository;

    @GetMapping("/listSubject")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> getListCouncilOfLecturer(@RequestHeader("Authorization") String authorizationHeader){
        try {
            System.out.println("KL");
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            System.out.println("Type: "+typeSubject.getTypeName());
            return new ResponseEntity<>(evaluationAndScoringService.getListCouncilOfLecturerGraduation(authorizationHeader,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            System.out.println(" kl");
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

    @GetMapping("/detailSubject/{id}")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> detailSubject(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(evaluationAndScoringService.detailSubjectLecturerCouncil(authorizationHeader,id),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/detailCouncil/{id}")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> detailCouncil(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(evaluationAndScoringService.detailCouncil(authorizationHeader,id),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/review-score/{id}")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
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
