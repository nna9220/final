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
import org.springframework.web.bind.annotation.RequestHeader;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ManageTutorialSubjectService {
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private MailServiceImpl mailService;

    //Thông báo nộp 50%
    public ResponseEntity<?> NoticeOfFiftyReportSubmission(int id,@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            if (existedSubject!=null){
                existedSubject.setActive((byte)2);
                var newSubject = subjectRepository.save(existedSubject);
                LocalDate today = LocalDate.now();
                LocalDate nextWeek = today.plusDays(7);
                String subject = "ĐẾN THỜI GIAN NỘP BÁO CÁO 50%";
                String messenger = "Topic: " + existedSubject.getSubjectName()+"\n" +
                        "GVHD: " + personCurrent.getUsername() + "\n"
                        + "Sinh viên vui lòng truy cập website https://hcmute.workon.space/ để thực hiện nộp báo cáo 50% trong vòng 1 tuần kể từ ngày " + today + " đến ngày " + nextWeek;

                Student student1 = studentRepository.findById(newSubject.getStudent1()).orElse(null);
                Student student2 = studentRepository.findById(newSubject.getStudent2()).orElse(null);
                Student student3 = studentRepository.findById(newSubject.getStudent3()).orElse(null);
                List<String> emailPerson = new ArrayList<>();
                if (student1!=null){
                    emailPerson.add(student1.getPerson().getUsername());
                }
                if (student2!=null){
                    emailPerson.add(student2.getPerson().getUsername());
                }
                if (student3!=null){
                    emailPerson.add(student3.getPerson().getUsername());
                }
                if (!emailPerson.isEmpty()){
                    mailService.sendMailToPerson(emailPerson,subject,messenger);
                }
                return new ResponseEntity<>(newSubject, HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //Thông báo nộp báo cáo 50% cho 1 list subject
    //Tìm danh sách tất cả đề tài của GVHD có type=a,active=1,status=true,
    public ResponseEntity<?> NoticeOfFiftyReportSubmissionToListSubject(@RequestHeader("Authorization") String authorizationHeader, TypeSubject typeSubject){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            List<Subject> existedSubjects = subjectRepository.findSubjectByInstructorAndStatusAndActiveAndTypeSubject(existedLecturer,true,typeSubject,(byte)1);
            for (Subject existedSubject:existedSubjects) {
                existedSubject.setActive((byte)2);
                var newSubject = subjectRepository.save(existedSubject);
                LocalDate today = LocalDate.now();
                LocalDate nextWeek = today.plusDays(7);
                String subject = "ĐẾN THỜI GIAN NỘP BÁO CÁO 50%";
                String messenger = "Topic: " + existedSubject.getSubjectName()+"\n" +
                        "GVHD: " + personCurrent.getUsername() + "\n"
                        + "Sinh viên vui lòng truy cập website https://hcmute.workon.space/ để thực hiện nộp báo cáo 50% trong vòng 1 tuần kể từ ngày " + today + " đến ngày " + nextWeek;
                Student student1 = studentRepository.findById(newSubject.getStudent1()).orElse(null);
                Student student2 = studentRepository.findById(newSubject.getStudent2()).orElse(null);
                Student student3 = studentRepository.findById(newSubject.getStudent3()).orElse(null);
                List<String> emailPerson = new ArrayList<>();
                if (student1!=null){
                    emailPerson.add(student1.getPerson().getUsername());
                }
                if (student2!=null){
                    emailPerson.add(student2.getPerson().getUsername());
                }
                if (student3!=null){
                    emailPerson.add(student3.getPerson().getUsername());
                }
                if (!emailPerson.isEmpty()){
                    mailService.sendMailToPerson(emailPerson,subject,messenger);
                }
                return new ResponseEntity<>(newSubject, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    //Thông báo nộp 100%
    public ResponseEntity<?> NoticeOfOneHundredReportSubmission(int id,@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            if (existedSubject!=null){
                existedSubject.setActive((byte)4);
                var newSubject = subjectRepository.save(existedSubject);
                LocalDate today = LocalDate.now();
                LocalDate nextWeek = today.plusDays(7);
                String subject = "ĐẾN THỜI GIAN NỘP BÁO CÁO 100%";
                String messenger = "Topic: " + existedSubject.getSubjectName()+"\n" +
                        "GVHD: " + personCurrent.getUsername() + "\n"
                        + "Sinh viên vui lòng truy cập website https://hcmute.workon.space/ để thực hiện nộp báo cáo 100% trong vòng 1 tuần kể từ ngày " + today + " đến ngày " + nextWeek;

                Student student1 = studentRepository.findById(newSubject.getStudent1()).orElse(null);
                Student student2 = studentRepository.findById(newSubject.getStudent2()).orElse(null);
                Student student3 = studentRepository.findById(newSubject.getStudent3()).orElse(null);
                List<String> emailPerson = new ArrayList<>();
                if (student1!=null){
                    emailPerson.add(student1.getPerson().getUsername());
                }
                if (student2!=null){
                    emailPerson.add(student2.getPerson().getUsername());
                }
                if (student3!=null){
                    emailPerson.add(student3.getPerson().getUsername());
                }
                if (!emailPerson.isEmpty()){
                    mailService.sendMailToPerson(emailPerson,subject,messenger);
                }
                return new ResponseEntity<>(newSubject, HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    public ResponseEntity<?> NoticeOfOneHundredReportSubmissionToListSubject(@RequestHeader("Authorization") String authorizationHeader, TypeSubject typeSubject){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            List<Subject> existedSubjects = subjectRepository.findSubjectByInstructorAndStatusAndActiveAndTypeSubject(existedLecturer,true,typeSubject,(byte)3);
            for (Subject existedSubject:existedSubjects) {
                existedSubject.setActive((byte)4);
                var newSubject = subjectRepository.save(existedSubject);
                LocalDate today = LocalDate.now();
                LocalDate nextWeek = today.plusDays(7);
                String subject = "ĐẾN THỜI GIAN NỘP BÁO CÁO 100%";
                String messenger = "Topic: " + existedSubject.getSubjectName()+"\n" +
                        "GVHD: " + personCurrent.getUsername() + "\n"
                        + "Sinh viên vui lòng truy cập website https://hcmute.workon.space/ để thực hiện nộp báo cáo 50% trong vòng 1 tuần kể từ ngày " + today + " đến ngày " + nextWeek;
                Student student1 = studentRepository.findById(newSubject.getStudent1()).orElse(null);
                Student student2 = studentRepository.findById(newSubject.getStudent2()).orElse(null);
                Student student3 = studentRepository.findById(newSubject.getStudent3()).orElse(null);
                List<String> emailPerson = new ArrayList<>();
                if (student1!=null){
                    emailPerson.add(student1.getPerson().getUsername());
                }
                if (student2!=null){
                    emailPerson.add(student2.getPerson().getUsername());
                }
                if (student3!=null){
                    emailPerson.add(student3.getPerson().getUsername());
                }
                if (!emailPerson.isEmpty()){
                    mailService.sendMailToPerson(emailPerson,subject,messenger);
                }
                return new ResponseEntity<>(newSubject, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
