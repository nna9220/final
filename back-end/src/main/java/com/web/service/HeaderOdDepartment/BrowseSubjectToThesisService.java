package com.web.service.HeaderOdDepartment;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.LecturerRepository;
import com.web.repository.PersonRepository;
import com.web.repository.StudentRepository;
import com.web.repository.SubjectRepository;
import com.web.service.MailServiceImpl;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BrowseSubjectToThesisService {
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private StudentRepository studentRepository;

    //Danh sách các đề tài có active=6
    public ResponseEntity<?> getListOfSubjectHaveReportOneHundred(String authorizationHeader, TypeSubject typeSubject){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            List<Subject> existedSubjects = subjectRepository.findSubjectByThesisAndStatusAndActiveAndTypeSubject(existedLecturer,true,typeSubject,(byte)6);
            return new ResponseEntity<>(existedSubjects, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //Duyệt đề tài qua GVPB - Của trưởng bộ môn
    public ResponseEntity<?> CompletedSubjectBrowseToThesis(String authorizationHeader, int id){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            if (existedSubject!=null){
                existedSubject.setActive((byte)7);
                subjectRepository.save(existedSubject);
                //Kiểm tra xem đã có hội đồng chưa
                List<String> emailPerson = new ArrayList<>();
                if (existedSubject.getStudent1()!=null) {
                    Student student1 = studentRepository.findById(existedSubject.getStudent1()).orElse(null);
                    if (student1.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                        emailPerson.add(student1.getPerson().getUsername());
                    }
                }
                if (existedSubject.getStudent2()!=null) {
                    Student student2 = studentRepository.findById(existedSubject.getStudent2()).orElse(null);
                    if (student2.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                        emailPerson.add(student2.getPerson().getUsername());
                    }
                }
                if (existedSubject.getStudent3()!=null) {
                    Student student3 = studentRepository.findById(existedSubject.getStudent3()).orElse(null);
                    if (student3.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                        emailPerson.add(student3.getPerson().getUsername());
                    }
                }
                emailPerson.add(existedSubject.getThesisAdvisorId().getPerson().getUsername());
                String subject = "Topic: " + existedSubject.getSubjectName();
                String messenger = "Topic: " + existedSubject.getSubjectName() + " đã được Trưởng bộ môn phê duyệt thông qua GVPB, truy cập website để biết thông tin ngày giờ, địa điểm phản biện";
                //Gửi mail cho Hội đồng - SV
                mailService.sendMailToPerson(emailPerson,subject,messenger);
                return new ResponseEntity<>(existedSubject,HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }



}
