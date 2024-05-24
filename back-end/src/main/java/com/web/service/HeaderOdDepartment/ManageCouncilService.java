package com.web.service.HeaderOdDepartment;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.*;
import com.web.service.MailServiceImpl;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@Service
public class ManageCouncilService {
    @Autowired
    private CouncilRepository councilRepository;
    @Autowired
    private ResultGraduationRepository resultGraduationRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private MailServiceImpl mailService;

    public ResponseEntity<?> getListSubject(String authorizationHeader, TypeSubject typeSubject) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer lecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            List<Subject> subjects = subjectRepository.findSubjectByActiveAndStatusAndMajorAndType((byte)1,lecturer.getMajor(),typeSubject);
            return new ResponseEntity<>(subjects,HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    private java.sql.Date convertToSqlDate(String dateString) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            java.util.Date parsedDate = dateFormat.parse(dateString);
            return new java.sql.Date(parsedDate.getTime());
        } catch (ParseException e) {
            // Xử lý ngoại lệ khi có lỗi trong quá trình chuyển đổi
            e.printStackTrace();
            return null; // hoặc throw một Exception phù hợp
        }
    }

    public ResponseEntity<?> createNewCouncil(int id,String authorizationHeader,String timeReport, String addressReport,
                                              List<String> lecturer){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject subject = subjectRepository.findById(id).orElse(null);
            if (subject!=null){
                if (subject.getCouncil()!=null) {
                    Council council = subject.getCouncil();
                    council.setAddress(addressReport);
                    council.setTimeReport(convertToSqlDate(timeReport));
                    List<Lecturer> lecturers = new ArrayList<>();
                    for (String lecturerId:lecturer) {
                        Lecturer existedLecturer = lecturerRepository.findById(lecturerId).orElse(null);
                        if (existedLecturer!=null){
                            lecturers.add(existedLecturer);
                        }
                    }
                    council.setLecturers(lecturers);
                    council.setSubject(subject);
                    councilRepository.save(council);
                    subject.setCouncil(council);
                    subjectRepository.save(subject);
                    List<String> emailPerson = new ArrayList<>();
                    String subjectMail = "HỘI ĐỒNG PHẢN BIỆN ĐỀ TÀI " + subject.getSubjectName();
                    String messenger = "Đã được phân hội đồng phản biện đề tài: " + subject.getSubjectName();
                    for (Lecturer l: council.getLecturers()) {
                        emailPerson.add(l.getPerson().getUsername());
                    }
                    if (!emailPerson.isEmpty()){
                        mailService.sendMailToPerson(emailPerson,subjectMail,messenger);
                    }

                    return new ResponseEntity<>(council,HttpStatus.CREATED);
                }else{
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }



    public ResponseEntity<?> updateCouncil(int id,String authorizationHeader,String timeReport, String addressReport,
                                              String lecturer2,String lecturer3,String lecturer4,String lecturer5){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject subject = subjectRepository.findById(id).orElse(null);
            if (subject!=null){
                if (subject.getCouncil()!=null) {
                    Council council = subject.getCouncil();
                    council.setAddress(addressReport);
                    council.setTimeReport(convertToSqlDate(timeReport));
                    List<Lecturer> lecturers = new ArrayList<>();
                    if (lecturer2!=null){
                        Lecturer existedLecturer2 = lecturerRepository.findById(lecturer2).orElse(null);
                        if (existedLecturer2!=null){
                            lecturers.add(existedLecturer2);
                            existedLecturer2.getCouncils().add(council);
                            lecturerRepository.save(existedLecturer2);
                        }
                    }
                    if (lecturer3!=null){
                        Lecturer existedLecturer3 = lecturerRepository.findById(lecturer3).orElse(null);
                        if (existedLecturer3!=null){
                            lecturers.add(existedLecturer3);
                            existedLecturer3.getCouncils().add(council);
                            lecturerRepository.save(existedLecturer3);
                        }
                    }
                    if (lecturer4!=null){
                        Lecturer existedLecturer4 = lecturerRepository.findById(lecturer4).orElse(null);
                        if (existedLecturer4!=null){
                            lecturers.add(existedLecturer4);

                            existedLecturer4.getCouncils().add(council);
                            lecturerRepository.save(existedLecturer4);
                        }
                    }
                    if (lecturer5!=null){
                        Lecturer existedLecturer5 = lecturerRepository.findById(lecturer5).orElse(null);
                        if (existedLecturer5!=null){
                            lecturers.add(existedLecturer5);
                            existedLecturer5.getCouncils().add(council);
                            lecturerRepository.save(existedLecturer5);
                        }
                    }
                    council.setLecturers(lecturers);
                    council.setSubject(subject);
                    councilRepository.save(council);
                    subject.setCouncil(council);
                    subjectRepository.save(subject);
                    List<String> emailPerson = new ArrayList<>();
                    String subjectMail = "HỘI ĐỒNG PHẢN BIỆN ĐỀ TÀI " + subject.getSubjectName();
                    String messenger = "Đã được phân hội đồng phản biện đề tài: " + subject.getSubjectName();
                    for (Lecturer l: council.getLecturers()) {
                        emailPerson.add(l.getPerson().getUsername());
                    }
                    if (!emailPerson.isEmpty()){
                        mailService.sendMailToPerson(emailPerson,subjectMail,messenger);
                    }

                    return new ResponseEntity<>(council,HttpStatus.CREATED);
                }else{
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
