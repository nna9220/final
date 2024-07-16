package com.web.controller.HeadOfDepartment.Graduation;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.*;
import com.web.service.Council.CouncilCreationService;
import com.web.service.Council.EvaluationAndScoringService;
import com.web.service.HeaderOdDepartment.ManageCouncilService;
import com.web.service.HeaderOdDepartment.WordExportService;
import com.web.utils.UserUtils;
import com.web.service.Lecturer.ManageTutorialSubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/head/manager/council")
@RequiredArgsConstructor
public class HeadManageCouncilController {
    @Autowired
    private EvaluationAndScoringService evaluationAndScoringService;
    @Autowired
    private WordExportService wordExportService;
    @Autowired
    private ManageCouncilService manageCouncilService;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private CouncilCreationService councilCreationService;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private CouncilLecturerRepository councilLecturerRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private CouncilRepository councilRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private ManageTutorialSubjectService manageTutorialSubjectService;
    @Autowired
    private TokenUtils tokenUtils;
    @GetMapping("/listSubject")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> getListSubject(@RequestHeader("Authorization") String authorizationHeader){
        try {

            String token = tokenUtils.extractToken(authorizationHeader);
            Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
            System.out.println("person: "+personCurrent.getPersonId());
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            return new ResponseEntity<>(manageCouncilService.getListSubject(authorizationHeader,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/listLecturer/{subjectId}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<Map<String,Object>> getAddCounterArgument(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject currentSubject = subjectRepository.findById(subjectId).orElse(null);
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);

            List<Lecturer> lecturerList = lecturerRepository.getListLecturerNotLecInstructor(currentSubject.getInstructorId().getLecturerId());
            Map<String,Object> response = new HashMap<>();
            response.put("listLecturer", lecturerList);
            response.put("person",personCurrent);
            response.put("subject", currentSubject);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
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
            return new ResponseEntity<>(evaluationAndScoringService.detailCouncil(authorizationHeader, id), HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/edit/{subjectId}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    private ResponseEntity<?> editCouncil(@RequestHeader("Authorization") String authorizationHeader,
                                                  @PathVariable int subjectId,
                                          @RequestParam("timeStart") String timeStart,
                                          @RequestParam("date") String date,
                                          @RequestParam("timeEnd") String timeEnd,
                                          @RequestParam("address") String address,
                                          @RequestParam(value = "lecturer1", required = false)String lecturer1,
                                          @RequestParam(value = "lecturer2", required = false)String lecturer2,
                                          @RequestParam(value = "lecturer3",required = false)String lecturer3,
                                          @RequestParam(value = "lecturer4",required = false)String lecturer4,
                                          @RequestParam(value = "lecturer5",required = false)String lecturer5){
        System.out.println("Hello");
        try {
            return new ResponseEntity<>(manageCouncilService.updateCouncil(subjectId,authorizationHeader,date,timeStart,timeEnd,address,lecturer1,lecturer2,lecturer3,lecturer4,lecturer5),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }




    @PostMapping("/autoCouncil")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> autoCouncil(@RequestHeader("Authorization") String authorizationHeader,
                                         @RequestParam("address") String address,
                                         @RequestParam("date") String date){
        return councilCreationService.createCouncils(date,address,authorizationHeader);
    }


    //thông tin đề tài, council_lecturer
    @GetMapping("/detail/{subjectId}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    private ResponseEntity<Map<String,Object>> getDetailSubjectCouncilLecturer(@RequestHeader("Authorization") String authorizationHeader,
                                                                @PathVariable int subjectId){
        try {
            String token = tokenUtils.extractToken(authorizationHeader);
            Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject existedSubject = subjectRepository.findById(subjectId).orElse(null);
            if (existedSubject!=null){
                Council existedCouncil = councilRepository.getCouncilBySubject(existedSubject);
                if (existedCouncil!=null){
                    List<CouncilLecturer> councilLecturers = councilLecturerRepository.getListCouncilLecturerByCouncil(existedCouncil);
                    Map<String,Object> response = new HashMap<>();
                    response.put("subject",existedSubject);
                    List<Lecturer> lecturers = new ArrayList<>();
                    for (CouncilLecturer c:councilLecturers) {
                        lecturers.add(c.getLecturer());
                    }
                    response.put("council",existedCouncil);
                    response.put("councilLecturer",councilLecturers);
                    response.put("listLecturerOfCouncil", lecturers);
                    return new ResponseEntity<>(response,HttpStatus.OK);
                }else {
                    //mã 417
                    return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
                }
            }else {
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


    @GetMapping("/detailCouncilReportTime")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> detailCouncilReportTime(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            return manageCouncilService.getDetailCouncilReportTime(typeSubject);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }


}
