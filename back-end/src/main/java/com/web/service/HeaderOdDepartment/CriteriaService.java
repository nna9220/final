package com.web.service.HeaderOdDepartment;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.*;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CriteriaService {
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
    private SubjectRepository subjectRepository;

    public static LocalDate convertStringToLocalDate(String dateString) {
        String pattern = "yyyy/MM/dd";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
        try {
            return LocalDate.parse(dateString, formatter);
        } catch (DateTimeParseException e) {
            System.out.println("Invalid date format: " + e.getMessage());
            return null;
        }
    }

    public ResponseEntity<?> saveCriteria(@RequestHeader("Authorization") String authorizationHeader, TypeSubject typeSubject, String nameCriteria, Double scoreCriteria){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        LocalDate nowDate = LocalDate.now();
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            //Tìm kiếm tất cả Đề tài theo chuyên ngành, loại đề tài và set tiêu chí là cái này
            Set<Subject> subjects = subjectRepository.getSubjectByMajorAnType(existedLecturer.getMajor(),typeSubject);
            EvaluationCriteria evaluationCriteria = new EvaluationCriteria();
            evaluationCriteria.setMajor(existedLecturer.getMajor());
            evaluationCriteria.setCriteriaName(nameCriteria);
            evaluationCriteria.setTypeSubject(typeSubject);
            evaluationCriteria.setYear(String.valueOf(nowDate.getYear()));
            evaluationCriteria.setCriteriaScore(scoreCriteria);
            evaluationCriteriaRepository.save(evaluationCriteria);
            for (Subject subject : subjects) {
                LocalDate localDate = convertStringToLocalDate(subject.getYear());
                if (localDate.getYear()==nowDate.getYear()) {
                    subject.getCriteria().add(evaluationCriteria);
                }
            }
            subjectRepository.saveAll(subjects);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


    public ResponseEntity<?> updateCriteria(int id, @RequestHeader("Authorization") String authorizationHeader, String nameCriteria, Double scoreCriteria){
        String token = tokenUtils.extractToken(authorizationHeader);
        LocalDate nowDate = LocalDate.now();
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            EvaluationCriteria existedCriteria = evaluationCriteriaRepository.findById(id).orElse(null);
            if (existedCriteria != null) {
                existedCriteria.setCriteriaName(nameCriteria);
                existedCriteria.setCriteriaScore(scoreCriteria);
                existedCriteria.setYear(String.valueOf(nowDate.getYear()));
                evaluationCriteriaRepository.save(existedCriteria);
                return new ResponseEntity<>(existedCriteria, HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    public ResponseEntity<?> removeCriteria(int id, @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            EvaluationCriteria existedCriteria = evaluationCriteriaRepository.findById(id).orElse(null);
            if (existedCriteria != null) {
                List<Subject> subjects = subjectRepository.findAll();
                for (Subject subject : subjects) {
                    if (subject.getCriteria().contains(existedCriteria)) {
                        // Xóa tiêu chí khỏi Subject
                        subject.removeCriteria(existedCriteria);
                        subjectRepository.save(subject); // Lưu Subject sau khi xóa tiêu chí
                    }
                }
                evaluationCriteriaRepository.delete(existedCriteria);
                return new ResponseEntity<>(HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


}
