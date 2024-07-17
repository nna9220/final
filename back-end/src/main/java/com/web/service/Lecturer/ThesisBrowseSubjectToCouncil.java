package com.web.service.Lecturer;

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
    private CouncilLecturerRepository councilLecturerRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private ReviewByThesisRepository reviewByThesisRepository;

    //Danh sách các đề tài có active=7
    public ResponseEntity<?> getListOfSubjectWasHeadBrowse(String authorizationHeader, TypeSubject typeSubject){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        System.out.println("");
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            System.out.println("Lecturer current: " + existedLecturer.getPerson().getFirstName() + existedLecturer.getPerson().getLastName());
            List<Subject> existedSubjects = subjectRepository.findSubjectByThesisAndStatusAndActiveAndTypeSubject(existedLecturer,true,typeSubject,(byte)7);
            for (Subject subject: existedSubjects) {
                System.out.println(subject.getSubjectName());
            }
            return new ResponseEntity<>(existedSubjects, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //GVPB duyệt đề tài qua hội đồng
    public ResponseEntity<?> CompletedSubjectBrowseToCouncil(String authorizationHeader, int id,
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
                    existedSubject.setActive((byte) 8);
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
                    List<CouncilLecturer> councilLecturers = councilLecturerRepository.getListCouncilLecturerByCouncil(existedSubject.getCouncil());
                    List<Lecturer> lecturers = new ArrayList<>();
                    for (CouncilLecturer c : councilLecturers) {
                        lecturers.add(c.getLecturer());
                    }
                    if (existedSubject.getCouncil() != null) {
                        for (Lecturer lecturer : lecturers) {
                            if (lecturer != existedLecturer) {
                                emailPerson.add(lecturer.getPerson().getUsername());
                            }
                        }
                        String subject = "Topic: " + existedSubject.getSubjectName();
                        String messenger = "Topic: " + existedSubject.getSubjectName() + " đã được giảng viên phản biện thông qua hội đồng, truy cập website để biết thông tin ngày giờ, địa điểm bảo vệ";
                        //Gửi mail cho Hội đồng - SV
                        mailService.sendMailToPerson(emailPerson, subject, messenger);
                    } else { //Nếu chưa có thì thông báo truy cập tạo hội đồng
                        //Kiểm tra nếu mã trả về mã 302 - Check mã rồi ra TB
                        return new ResponseEntity<>(HttpStatus.FOUND);
                    }
                    return new ResponseEntity<>(existedSubject, HttpStatus.OK);
                }else {
                    existedSubject.setActive((byte) -1);
                    subjectRepository.save(existedSubject);
                    String subject = "Topic: " + existedSubject.getSubjectName();
                    String messenger = "Topic: " + existedSubject.getSubjectName() + "không đủ điều kiện tham gia báo cáo, đề tài bị đánh rớt" + "\n" +
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



}
