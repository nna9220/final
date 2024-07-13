package com.web.controller.HeadOfDepartment;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.Person;
import com.web.entity.TimeBrowsOfHead;
import com.web.entity.TypeSubject;
import com.web.repository.PersonRepository;
import com.web.repository.SubjectRepository;
import com.web.repository.TimeBrowseHeadRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.HeaderOdDepartment.BrowseSubjectToThesisService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/head/browseThesis")
public class HeadBrowseSubjectToThesisController {
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private BrowseSubjectToThesisService manageCriticalSubjectService;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TimeBrowseHeadRepository timeBrowseHeadRepository;
    private final TokenUtils tokenUtils;
    @Autowired
    public HeadBrowseSubjectToThesisController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }


    //TBM DUYỆT ĐỀ TÀI CHO QUA GVPB

    //Danh sách đề tài cần duyệt qua GVPB
    @GetMapping("/listSubject")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> getListSubject(@RequestHeader("Authorization") String authorizationHeader){
        try {
            System.out.println("Ds subject");
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            return new ResponseEntity<>(manageCriticalSubjectService.getListOfSubjectHaveReportOneHundred(authorizationHeader,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }


    //TBM duyệt đề tài qua GVPB
    @PostMapping("/accept-multiple-subjects")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> completedMultipleSubjectsBrowseToCouncil(
            @RequestBody List<Integer> subjectIds,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            return new ResponseEntity<>(manageCriticalSubjectService.completedMultipleSubjectsBrowseToThesis(authorizationHeader, subjectIds), HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error while processing subjects: " + e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
