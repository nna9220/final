package com.web.controller.HeadOfDepartment.Graduation;

import com.web.entity.TypeSubject;
import com.web.repository.TypeSubjectRepository;
import com.web.service.HeaderOdDepartment.ManageCouncilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/head/manager/council")
public class HeadManageCouncilController {
    @Autowired
    private ManageCouncilService manageCouncilService;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @GetMapping("/listSubject")
    public ResponseEntity<?> getListSubject(@RequestHeader("Authorization") String authorizationHeader){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            return new ResponseEntity<>(manageCouncilService.getListSubject(authorizationHeader,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/edit/{subjectId}")
    private ResponseEntity<?> editCouncil(@RequestHeader("Authorization") String authorizationHeader,
                                          @PathVariable int subjectId,
                                          @RequestParam("time") String time,
                                          @RequestParam("address") String address,
                                          @RequestParam("lecturers")List<String> lecturers){
        try {
            return new ResponseEntity<>(manageCouncilService.createNewCouncil(subjectId,authorizationHeader,time,address,lecturers),HttpStatus.OK);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }
}
