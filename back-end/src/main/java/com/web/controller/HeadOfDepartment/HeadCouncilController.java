package com.web.controller.HeadOfDepartment;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.*;
import com.web.service.Council.EvaluationAndScoringService;
import com.web.service.HeaderOdDepartment.ManageCouncilService;
import com.web.service.Lecturer.ManageTutorialSubjectService;
import com.web.utils.UserUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/head/council")
@RequiredArgsConstructor
public class HeadCouncilController {
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private CouncilLecturerRepository councilLecturerRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private CouncilRepository councilRepository;
    @Autowired
    private PersonRepository personRepository;
    private final TokenUtils tokenUtils;
    @Autowired
    private EvaluationAndScoringService evaluationAndScoringService;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private ManageCouncilService manageCouncilService;
    @Autowired
    private ManageTutorialSubjectService manageTutorialSubjectService;
    @GetMapping("/listSubject")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> getListCouncilOfLecturer(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            if (typeSubject == null) {
                return new ResponseEntity<>("TypeSubject not found", HttpStatus.NOT_FOUND);
            }
            return evaluationAndScoringService.getListCouncilOfLecturer(authorizationHeader, typeSubject);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/listCouncil")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> getListSubject(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            return new ResponseEntity<>(manageCouncilService.getListSubject(authorizationHeader,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/listCriteria")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> getListCriteria(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            return new ResponseEntity<>(manageTutorialSubjectService.getListCriteria(authorizationHeader,typeSubject),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }
    @GetMapping("/detailSubject/{id}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> detailSubject(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(evaluationAndScoringService.detailSubjectLecturerCouncil(authorizationHeader,id),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/detailCouncil/{id}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> detailCouncil(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader){
        try {
            return new ResponseEntity<>(evaluationAndScoringService.detailCouncil(authorizationHeader,id),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/evaluation-scoring/{id}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> evaluationAndScoring(@PathVariable int id,@RequestHeader("Authorization") String authorizationHeader,
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
            return new ResponseEntity<>(evaluationAndScoringService.evaluationAndScoringEssay(authorizationHeader,id,studentId1,studentId2,studentId3,review1,review2,review3,score1,score2,score3),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }


    @PostMapping("/editCouncilEssay/{id}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> updateCouncil(@PathVariable int id,@RequestHeader("Authorization") String authorizationHeader,
                                           @RequestParam(value = "lecturer1", required = false) String lecturer1,
                                           @RequestParam(value = "lecturer2", required = false) String lecturer2,
                                           @RequestParam(value = "start", required = false) String start,
                                           @RequestParam(value = "end", required = false) String end,
                                           @RequestParam(value = "date", required = false) String date,
                                           @RequestParam(value = "address", required = false) String address){
        try {
            return new ResponseEntity<>(manageCouncilService.updateCouncilEssay(id,authorizationHeader,date,start,end,address,lecturer1,lecturer2),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }



//    @GetMapping("/detailSubject/{subjectId}")
//    @PreAuthorize("hasAuthority('ROLE_HEAD')")
//    private ResponseEntity<Map<String,Object>> getDetailSubjectCouncilLecturer(@RequestHeader("Authorization") String authorizationHeader,
//                                                                               @PathVariable int subjectId){
//        try {
//            Subject existedSubject = subjectRepository.findById(subjectId).orElse(null);
//            if (existedSubject!=null){
//                Council existedCouncil = councilRepository.getCouncilBySubject(existedSubject);
//                if (existedCouncil!=null){
//                    List<CouncilLecturer> councilLecturers = councilLecturerRepository.getListCouncilLecturerByCouncil(existedCouncil);
//                    Map<String,Object> response = new HashMap<>();
//                    response.put("subject",existedSubject);
//                    List<Lecturer> lecturers = new ArrayList<>();
//                    for (CouncilLecturer c:councilLecturers) {
//                        lecturers.add(c.getLecturer());
//                    }
//                    response.put("council",existedCouncil);
//                    response.put("councilLecturer",councilLecturers);
//                    response.put("listLecturerOfCouncil", lecturers);
//                    return new ResponseEntity<>(response,HttpStatus.OK);
//                }else {
//                    //mã 417
//                    return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
//                }
//            }else {
//                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//            }
//        }catch (Exception e){
//            System.err.println("Initial SessionFactory creation failed." + e);
//            throw new ExceptionInInitializerError(e);
//        }
//    }

}
