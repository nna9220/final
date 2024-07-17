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

import java.time.LocalDateTime;
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
    @Autowired
    private ReviewByThesisRepository reviewByThesisRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    //Danh sách các đề tài có active=6
    public ResponseEntity<?> getListOfSubjectHaveReportOneHundred(String authorizationHeader, TypeSubject typeSubject){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        System.out.println("Hello");
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            System.out.println("sauif check role");
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            List<Subject> existedSubjects = subjectRepository.findSubjectByMajorAndStatusAndActiveAndTypeSubject(existedLecturer.getMajor(),true,typeSubject,(byte)6);
            System.out.println(existedSubjects.size());
            for (Subject s :existedSubjects) {
                System.out.println("list subject" + s.getSubjectName());
            }
            return new ResponseEntity<>(existedSubjects, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //Duyệt đề tài qua GVPB - Của trưởng bộ môn
    public ResponseEntity<?> CompletedSubjectBrowseToThesis(String authorizationHeader, int id,
                                                            String reviewContent, String reviewAdvantage, String reviewWeakness,
                                                            Boolean status,String classification, double score){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            if (existedSubject!=null){
                //create reviewByThesis
                ReviewByThesis reviewByThesis = new ReviewByThesis();
                reviewByThesis.setSubject(existedSubject);
                reviewByThesis.setThesisId(existedSubject.getThesisAdvisorId());
                reviewByThesis.setReviewContent(reviewContent);
                reviewByThesis.setReviewAdvantage(reviewAdvantage);
                reviewByThesis.setReviewWeakness(reviewWeakness);
                reviewByThesis.setStatus(status);
                reviewByThesis.setClassification(classification);
                reviewByThesis.setScore(score);
                existedSubject.getThesisAdvisorId().getReviewByTheses().add(reviewByThesis);
                reviewByThesisRepository.save(reviewByThesis);
                lecturerRepository.save(existedSubject.getThesisAdvisorId());
                if (status) {
                    existedSubject.setActive((byte) 7);
                    subjectRepository.save(existedSubject);
                    //Kiểm tra xem đã có hội đồng chưa
                    List<String> emailPerson = new ArrayList<>();
                    if (existedSubject.getStudent1() != null) {
                        Student student1 = studentRepository.findById(existedSubject.getStudent1()).orElse(null);
                        if (student1.getPerson().getPersonId() != personCurrent.getPersonId()) {
                            emailPerson.add(student1.getPerson().getUsername());
                        }
                    }
                    if (existedSubject.getStudent2() != null) {
                        Student student2 = studentRepository.findById(existedSubject.getStudent2()).orElse(null);
                        if (student2.getPerson().getPersonId() != personCurrent.getPersonId()) {
                            emailPerson.add(student2.getPerson().getUsername());
                        }
                    }
                    if (existedSubject.getStudent3() != null) {
                        Student student3 = studentRepository.findById(existedSubject.getStudent3()).orElse(null);
                        if (student3.getPerson().getPersonId() != personCurrent.getPersonId()) {
                            emailPerson.add(student3.getPerson().getUsername());
                        }
                    }
                    emailPerson.add(existedSubject.getThesisAdvisorId().getPerson().getUsername());
                    String subject = "Topic: " + existedSubject.getSubjectName();
                    String messenger = "Topic: " + existedSubject.getSubjectName() + " đã được Trưởng bộ môn phê duyệt thông qua GVPB, vui lòng đợi thông báo và truy cập website để biết thông tin ngày giờ, địa điểm phản biện";
                    //Gửi mail cho Hội đồng - SV
                    mailService.sendMailToPerson(emailPerson, subject, messenger);
                    List<Person> personList = new ArrayList<>();
                    for (String s:emailPerson) {
                        Person p = personRepository.findUsername(s);
                        if (p!=null){
                            personList.add(p);
                        }
                    }
                    Notification notification = new Notification();
                    LocalDateTime now = LocalDateTime.now();
                    notification.setDateSubmit(now);
                    notification.setPersons(personList);
                    notification.setTitle(subject);
                    notification.setContent(messenger);
                    for (Person p : personList) {
                        p.getNotifications().add(notification);
                    }
                    notificationRepository.save(notification);
                    personRepository.saveAll(personList);
                    return new ResponseEntity<>(existedSubject, HttpStatus.OK);
                }else {
                    existedSubject.setActive((byte) -1);
                    subjectRepository.save(existedSubject);
                    String subject = "Topic: " + existedSubject.getSubjectName();
                    String messenger = "Topic: " + existedSubject.getSubjectName() + "không đủ điều kiện tham gia phản biện, đề tài bị đánh rớt" + "\n" +
                            "Điểm: " + reviewByThesis.getScore() + "\n" +
                            "Xếp  loại: " + reviewByThesis.getClassification();
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
                    if (!emailPerson.isEmpty()) {
                        mailService.sendMailToPerson(emailPerson, subject, messenger);
                    }
                    List<Person> personList = new ArrayList<>();
                    for (String s:emailPerson) {
                        Person p = personRepository.findUsername(s);
                        if (p!=null){
                            personList.add(p);
                        }
                    }
                    Notification notification = new Notification();
                    LocalDateTime now = LocalDateTime.now();
                    notification.setDateSubmit(now);
                    notification.setPersons(personList);
                    notification.setTitle(subject);
                    notification.setContent(messenger);
                    for (Person p : personList) {
                        p.getNotifications().add(notification);
                    }
                    notificationRepository.save(notification);
                    personRepository.saveAll(personList);
                    return new ResponseEntity<>(existedSubject, HttpStatus.OK);
                }
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    public ResponseEntity<?> completedMultipleSubjectsBrowseToThesis(String authorizationHeader, List<Integer> subjectIds) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);

        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            List<Subject> updatedSubjects = new ArrayList<>();

            for (Integer id : subjectIds) {
                Subject existedSubject = subjectRepository.findById(id).orElse(null);
                if (existedSubject != null) {
                    List<String> emailPerson = new ArrayList<>();
                    existedSubject.setActive((byte) 7);
                    updatedSubjects.add(existedSubject);

                    if (existedSubject.getStudent1() != null) {
                        Student student1 = studentRepository.findById(existedSubject.getStudent1()).orElse(null);
                        if (student1.getPerson().getPersonId() != personCurrent.getPersonId()) {
                            emailPerson.add(student1.getPerson().getUsername());
                        }
                    }
                    if (existedSubject.getStudent2() != null) {
                        Student student2 = studentRepository.findById(existedSubject.getStudent2()).orElse(null);
                        if (student2.getPerson().getPersonId() != personCurrent.getPersonId()) {
                            emailPerson.add(student2.getPerson().getUsername());
                        }
                    }
                    if (existedSubject.getStudent3() != null) {
                        Student student3 = studentRepository.findById(existedSubject.getStudent3()).orElse(null);
                        if (student3.getPerson().getPersonId() != personCurrent.getPersonId()) {
                            emailPerson.add(student3.getPerson().getUsername());
                        }
                    }
                    emailPerson.add(existedSubject.getThesisAdvisorId().getPerson().getUsername());
                    String subject = "THÔNG BÁO ĐỀ TÀI " + existedSubject.getSubjectName() + " ĐÃ ĐƯỢC THÔNG QUA PHẢN BIỆN";
                    String messenger = "Đề tài " + existedSubject.getSubjectName()+ "  đã được trưởng bộ môn phê duyệt. Sinh viên và Giảng viên phản biện truy cập website để xem thông tin chi tiết.";
                    mailService.sendMailToPerson(emailPerson, subject, messenger);
                }
            }

            // Save all updated subjects
            subjectRepository.saveAll(updatedSubjects);

            // Send email to all relevant persons

            return new ResponseEntity<>(updatedSubjects, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


}
