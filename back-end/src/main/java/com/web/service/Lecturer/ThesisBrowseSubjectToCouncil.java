package com.web.service.Lecturer;

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
public class ThesisBrowseSubjectToCouncil {
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

    //Danh sách các đề tài có active=7
    public ResponseEntity<?> getListOfSubjectWasHeadBrowse(String authorizationHeader, TypeSubject typeSubject){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        System.out.println("");
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            List<Subject> existedSubjects = subjectRepository.findSubjectByThesisAndStatusAndActiveAndTypeSubject(existedLecturer,true,typeSubject,(byte)8);
            for (Subject subject: existedSubjects) {
                System.out.println(subject.getSubjectName());
            }
            return new ResponseEntity<>(existedSubjects, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //GVPB duyệt đề tài qua hội đồng
    public ResponseEntity<?> CompletedSubjectBrowseToCouncil(String authorizationHeader, int id){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            if (existedSubject!=null){
                existedSubject.setActive((byte)8);
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
                if (existedSubject.getCouncil()!=null) {
                    for (Lecturer lecturer : existedSubject.getCouncil().getLecturers()) {
                        if (lecturer!=existedLecturer) {
                            emailPerson.add(lecturer.getPerson().getUsername());
                        }
                    }
                    String subject = "Topic: " + existedSubject.getSubjectName();
                    String messenger = "Topic: " + existedSubject.getSubjectName() + " đã được Trưởng bộ môn phê duyệt thông qua GVPB, truy cập website để biết thông tin ngày giờ, địa điểm phản biện";
                    //Gửi mail cho Hội đồng - SV
                    mailService.sendMailToPerson(emailPerson,subject,messenger);
                }else { //Nếu chưa có thì thông báo truy cập tạo hội đồng
                    //Kiểm tra nếu mã trả về mã 302 - Check mã rồi ra TB
                    return new ResponseEntity<>(HttpStatus.FOUND);
                }
                return new ResponseEntity<>(existedSubject,HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }



}
