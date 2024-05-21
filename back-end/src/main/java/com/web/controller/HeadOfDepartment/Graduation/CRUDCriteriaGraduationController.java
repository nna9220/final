package com.web.controller.HeadOfDepartment.Graduation;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.EvaluationCriteria;
import com.web.entity.Lecturer;
import com.web.entity.Person;
import com.web.entity.TypeSubject;
import com.web.repository.EvaluationCriteriaRepository;
import com.web.repository.LecturerRepository;
import com.web.repository.PersonRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.HeaderOdDepartment.CriteriaService;
import com.web.utils.UserUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/head/graduation/criteria")
@RequiredArgsConstructor
public class CRUDCriteriaGraduationController {
    @Autowired
    private EvaluationCriteriaRepository evaluationCriteriaRepository;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private CriteriaService criteriaService;
    @GetMapping("/list")
    public ResponseEntity<?> getListCriteria(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            //Tìm GV
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            List<EvaluationCriteria> evaluationCriteria = evaluationCriteriaRepository.getEvaluationCriteriaByTypeSubjectAndCriteriaId(typeSubject, existedLecturer.getMajor());
            return new ResponseEntity<>(evaluationCriteria, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createCriteria(@RequestHeader("Authorization") String authorizationHeader,
                                            @RequestParam("nameCriteria") String nameCriteria,
                                            @RequestParam("scoreCriteria") Double scoreCriteria){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            return new ResponseEntity<>(criteriaService.saveCriteria(authorizationHeader,typeSubject,nameCriteria,scoreCriteria),HttpStatus.CREATED);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<?> editCriteria(@PathVariable int id,
                                          @RequestHeader("Authorization") String authorizationHeader,
                                            @RequestParam("nameCriteria") String nameCriteria,
                                            @RequestParam("scoreCriteria") Double scoreCriteria){
        try {
            return new ResponseEntity<>(criteriaService.updateCriteria(id,authorizationHeader,nameCriteria,scoreCriteria),HttpStatus.CREATED);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteCriteria(@PathVariable int id,
                                          @RequestHeader("Authorization") String authorizationHeader,
                                          @RequestParam("nameCriteria") String nameCriteria,
                                          @RequestParam("scoreCriteria") Double scoreCriteria){
        try {
            return criteriaService.removeCriteria(id,authorizationHeader);
        }catch (Exception e){
            System.err.println("Initial SessionFactory creation failed." + e);
            throw new ExceptionInInitializerError(e);
        }
    }

}
