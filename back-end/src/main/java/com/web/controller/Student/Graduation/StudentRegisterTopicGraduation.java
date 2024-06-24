package com.web.controller.Student.Graduation;

import com.web.config.CheckRole;
import com.web.config.CompareTime;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.*;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/student/subjectGraduation")
public class StudentRegisterTopicGraduation {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private RegistrationPeriodRepository registrationPeriodRepository;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;

    private final TokenUtils tokenUtils;
    @Autowired
    public StudentRegisterTopicGraduation(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<Map<String,Object>> getListSubject(@RequestHeader("Authorization") String authorizationHeader) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent != null && personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            Optional<Student> currentStudentOptional = studentRepository.findById(personCurrent.getPersonId());
            if (currentStudentOptional.isPresent()) {
                Student currentStudent = currentStudentOptional.get();
                if (currentStudent.getSubjectGraduationId() == null) {
                    TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
                    List<RegistrationPeriod> periodList = registrationPeriodRepository.getListPeriodBYStatusAndType(typeSubject);
                    if (currentStudent.getStatus()) {//mà k càn, nó k true thì k nhảy vô đây r đây hiện tạ mọi sv có status = false đợi tý t viết cái hàm edit all SV = True
                        if (CompareTime.isCurrentTimeInPeriodStudent(periodList)) {
                            List<Subject> subjectList = subjectRepository.findSubjectByStatusAndMajorAndStudent(true, currentStudent.getMajor(), typeSubject);
                            Map<String, Object> response = new HashMap<>();
                            response.put("person", personCurrent);
                            response.put("subjectList", subjectList);
                            return new ResponseEntity<>(response, HttpStatus.OK);
                        } else {
                            Map<String, Object> response = new HashMap<>();
                            response.put("person", personCurrent);
                            return new ResponseEntity<>(response, HttpStatus.OK);
                        }
                    } else {
                        //"Bạn không thuộc danh sách sinh vieen được đăng ký"
                        return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
                    }
                }
                else {
                    Subject existSubject = subjectRepository.findById(currentStudent.getSubjectGraduationId().getSubjectId()).orElse(null);
                    Map<String,Object> response = new HashMap<>();
                    response.put("person",personCurrent);
                    response.put("subject", existSubject);
                    return new ResponseEntity<>(response,HttpStatus.OK);

                }
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/registerTopic/{subjectId}")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<?> registerTopic(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader, HttpServletRequest request){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
                Student currentStudent = studentRepository.findById(personCurrent.getPersonId()).orElse(null);
                Subject existSubject = subjectRepository.findById(subjectId).orElse(null);
                if (existSubject != null) {
                    if (existSubject.getStudent1() == null) {
                        existSubject.setStudent1(currentStudent.getStudentId());
                        existSubject.setActive((byte)1);
                        currentStudent.setSubjectGraduationId(existSubject);
                    } else if (existSubject.getStudent2() == null) {
                        existSubject.setStudent2(currentStudent.getStudentId());
                        existSubject.setActive((byte)1);
                        currentStudent.setSubjectGraduationId(existSubject);
                    } else if (existSubject.getStudent3() == null) {
                        existSubject.setStudent3(currentStudent.getStudentId());
                        existSubject.setActive((byte)1);
                        currentStudent.setSubjectGraduationId(existSubject);
                    } else {
                        return new ResponseEntity<>("Đã đủ SVTH", HttpStatus.BAD_REQUEST);
                    }
                    subjectRepository.save(existSubject);
                    studentRepository.save(currentStudent);
                    return new ResponseEntity<>(currentStudent, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
