package com.web.service.Lecturer;

import com.web.config.CheckRole;
import com.web.config.CompareTime;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.*;
import com.web.service.MailServiceImpl;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestHeader;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ManageTutorialSubjectService {
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private AuthorityRepository authorityRepository;
    @Autowired
    private ReportSubmissionTimeRepository reportSubmissionTimeRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ResultGraduationRepository resultGraduationRepository;
    @Autowired
    private ResultEssayRepository resultEssayRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private ScoreEssayRepository scoreEssayRepository;
    @Autowired
    private ScoreGraduationRepository scoreGraduationRepository;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private EvaluationCriteriaRepository evaluationCriteriaRepository;
    @Autowired
    private ReviewByInstructorRepository reviewByInstructorRepository;
    @Autowired
    private ReviewByThesisRepository reviewByThesisRepository;

    //Thông báo nộp 50%
    public ResponseEntity<?> NoticeOfFiftyReportSubmission(int id,@RequestHeader("Authorization") String authorizationHeader, TypeSubject typeSubject){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            List<String> emailPerson = new ArrayList<>();
            if (existedSubject!=null){

                List<ReportSubmissionTime> reportSubmissionTimes = reportSubmissionTimeRepository.findReportTimeTypeSubjectAndStatus(typeSubject, true);

                if (reportSubmissionTimes==null){
                    return new ResponseEntity<>("Không tồn tại report time thỏa mãn", HttpStatus.NOT_MODIFIED);
                }
                if (!CompareTime.isCurrentTimeOutsideReportSubmissionTimes(reportSubmissionTimes)) {
                    return new ResponseEntity<>("Outside of report submission time window", HttpStatus.NOT_ACCEPTABLE);
                }
                existedSubject.setActive((byte)2);
                var newSubject = subjectRepository.save(existedSubject);
                LocalDate today = LocalDate.now();
                LocalDate nextWeek = today.plusDays(7);
                String subject = "ĐẾN THỜI GIAN NỘP BÁO CÁO 50%";
                String messenger = "Topic: " + existedSubject.getSubjectName()+"\n" +
                        "GVHD: " + personCurrent.getUsername() + "\n"
                        + "Sinh viên vui lòng truy cập website https://hcmute.workon.space/ để thực hiện nộp báo cáo 50% trong vòng 1 tuần kể từ ngày " + today + " đến ngày " + nextWeek;

                if (newSubject.getStudent1()!=null) {
                    Student student1 = studentRepository.findById(newSubject.getStudent1()).orElse(null);
                    emailPerson.add(student1.getPerson().getUsername());
                }
                if (newSubject.getStudent2()!=null) {
                    Student student2 = studentRepository.findById(newSubject.getStudent2()).orElse(null);
                    emailPerson.add(student2.getPerson().getUsername());
                }
                if (newSubject.getStudent3()!=null) {
                    Student student3 = studentRepository.findById(newSubject.getStudent3()).orElse(null);
                    emailPerson.add(student3.getPerson().getUsername());
                }
                if (!emailPerson.isEmpty()){
                    mailService.sendMailToPerson(emailPerson,subject,messenger);
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
                notificationRepository.save(notification);
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
            List<String> emailPerson = new ArrayList<>();
            LocalDate today = LocalDate.now();
            LocalDate nextWeek = today.plusDays(7);
            for (Subject existedSubject:existedSubjects) {
                List<ReportSubmissionTime> reportSubmissionTimes = reportSubmissionTimeRepository.findReportTimeTypeSubjectAndStatus(typeSubject, true);
                if (reportSubmissionTimes==null){
                    return new ResponseEntity<>("Không tồn tại report time thỏa mãn", HttpStatus.NOT_MODIFIED);
                }
                if (!CompareTime.isCurrentTimeOutsideReportSubmissionTimes(reportSubmissionTimes)) {
                    return new ResponseEntity<>("Outside of report submission time window", HttpStatus.NOT_ACCEPTABLE);
                }
                existedSubject.setActive((byte)2);
                var newSubject = subjectRepository.save(existedSubject);
                String subject = "ĐẾN THỜI GIAN NỘP BÁO CÁO 50%";
                String messenger = "Topic: " + existedSubject.getSubjectName()+"\n" +
                        "GVHD: " + personCurrent.getUsername() + "\n"
                        + "Sinh viên vui lòng truy cập website https://hcmute.workon.space/ để thực hiện nộp báo cáo 50% trong vòng 1 tuần kể từ ngày " + today + " đến ngày " + nextWeek;
                if (newSubject.getStudent1()!=null) {
                    Student student1 = studentRepository.findById(newSubject.getStudent1()).orElse(null);
                    emailPerson.add(student1.getPerson().getUsername());
                }
                if (newSubject.getStudent2()!=null) {
                    Student student2 = studentRepository.findById(newSubject.getStudent2()).orElse(null);
                    emailPerson.add(student2.getPerson().getUsername());
                }
                if (newSubject.getStudent3()!=null) {
                    Student student3 = studentRepository.findById(newSubject.getStudent3()).orElse(null);
                    emailPerson.add(student3.getPerson().getUsername());
                }
                if (!emailPerson.isEmpty()){
                    mailService.sendMailToPerson(emailPerson,subject,messenger);
                }
                List<Person> personList = new ArrayList<>();
                for (String s:emailPerson) {
                    Person p = personRepository.findUsername(s);
                    if (p!=null){
                        personList.add(p);
                    }
                }
                Notification notification = new Notification();
                notification.setPersons(personList);
                LocalDateTime now = LocalDateTime.now();
                notification.setDateSubmit(now);
                notification.setTitle(subject);
                notification.setContent(messenger);
                notificationRepository.save(notification);
                return new ResponseEntity<>(newSubject, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    //Thông báo nộp 100%
    public ResponseEntity<?> NoticeOfOneHundredReportSubmission(int id,@RequestHeader("Authorization") String authorizationHeader,TypeSubject typeSubject){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            if (existedSubject!=null){
                List<ReportSubmissionTime> reportSubmissionTimes = reportSubmissionTimeRepository.findReportTimeTypeSubjectAndStatus(typeSubject, true);
                if (reportSubmissionTimes==null){
                    return new ResponseEntity<>("Không tồn tại report time thỏa mãn", HttpStatus.NOT_MODIFIED);
                }
                if (!CompareTime.isCurrentTimeOutsideReportSubmissionTimes(reportSubmissionTimes)) {
                    return new ResponseEntity<>("Outside of report submission time window", HttpStatus.NOT_ACCEPTABLE);
                }
                existedSubject.setActive((byte)4);
                var newSubject = subjectRepository.save(existedSubject);
                LocalDate today = LocalDate.now();
                LocalDate nextWeek = today.plusDays(7);
                String subject = "ĐẾN THỜI GIAN NỘP BÁO CÁO 100%";
                String messenger = "Topic: " + existedSubject.getSubjectName()+"\n" +
                        "GVHD: " + personCurrent.getUsername() + "\n"
                        + "Sinh viên vui lòng truy cập website https://hcmute.workon.space/ để thực hiện nộp báo cáo 100% trong vòng 1 tuần kể từ ngày " + today + " đến ngày " + nextWeek;

                List<String> emailPerson = new ArrayList<>();
                if (newSubject.getStudent1()!=null) {
                    Student student1 = studentRepository.findById(newSubject.getStudent1()).orElse(null);
                    emailPerson.add(student1.getPerson().getUsername());
                }
                if (newSubject.getStudent2()!=null) {
                    Student student2 = studentRepository.findById(newSubject.getStudent2()).orElse(null);
                    emailPerson.add(student2.getPerson().getUsername());
                }
                if (newSubject.getStudent3()!=null) {
                    Student student3 = studentRepository.findById(newSubject.getStudent3()).orElse(null);
                    emailPerson.add(student3.getPerson().getUsername());
                }
                if (!emailPerson.isEmpty()){
                    mailService.sendMailToPerson(emailPerson,subject,messenger);
                }
                Notification notification = new Notification();
                LocalDateTime now = LocalDateTime.now();
                List<Person> personList = new ArrayList<>();
                for (String s:emailPerson) {
                    Person p = personRepository.findUsername(s);
                    if (p!=null){
                        personList.add(p);
                    }
                }
                notification.setPersons(personList);
                notification.setDateSubmit(now);
                notification.setTitle(subject);
                notification.setContent(messenger);
                notificationRepository.save(notification);
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
                List<ReportSubmissionTime> reportSubmissionTimes = reportSubmissionTimeRepository.findReportTimeTypeSubjectAndStatus(typeSubject, true);
                if (reportSubmissionTimes==null){
                    return new ResponseEntity<>("Không tồn tại report time thỏa mãn", HttpStatus.NOT_MODIFIED);
                }
                if (!CompareTime.isCurrentTimeOutsideReportSubmissionTimes(reportSubmissionTimes)) {
                    return new ResponseEntity<>("Outside of report submission time window", HttpStatus.NOT_ACCEPTABLE);
                }
                existedSubject.setActive((byte)4);
                var newSubject = subjectRepository.save(existedSubject);
                LocalDate today = LocalDate.now();
                LocalDate nextWeek = today.plusDays(7);
                String subject = "ĐẾN THỜI GIAN NỘP BÁO CÁO 100%";
                String messenger = "Topic: " + existedSubject.getSubjectName()+"\n" +
                        "GVHD: " + personCurrent.getUsername() + "\n"
                        + "Sinh viên vui lòng truy cập website https://hcmute.workon.space/ để thực hiện nộp báo cáo 100% trong vòng 1 tuần kể từ ngày " + today + " đến ngày " + nextWeek;
                List<String> emailPerson = new ArrayList<>();
                if (newSubject.getStudent1()!=null) {
                    Student student1 = studentRepository.findById(newSubject.getStudent1()).orElse(null);
                    emailPerson.add(student1.getPerson().getUsername());
                }
                if (newSubject.getStudent2()!=null) {
                    Student student2 = studentRepository.findById(newSubject.getStudent2()).orElse(null);
                    emailPerson.add(student2.getPerson().getUsername());
                }
                if (newSubject.getStudent3()!=null) {
                    Student student3 = studentRepository.findById(newSubject.getStudent3()).orElse(null);
                    emailPerson.add(student3.getPerson().getUsername());
                }
                if (!emailPerson.isEmpty()){
                    mailService.sendMailToPerson(emailPerson,subject,messenger);
                }
                Notification notification = new Notification();
                List<Person> personList = new ArrayList<>();
                for (String s:emailPerson) {
                    Person p = personRepository.findUsername(s);
                    if (p!=null){
                        personList.add(p);
                    }
                }
                notification.setPersons(personList);
                LocalDateTime now = LocalDateTime.now();
                notification.setDateSubmit(now);
                notification.setTitle(subject);
                notification.setContent(messenger);
                notificationRepository.save(notification);
                return new ResponseEntity<>(newSubject, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //Danh sách tiêu chí chấm điểm

    public ResponseEntity<?> getListCriteria(@RequestHeader("Authorization") String authorizationHeader, TypeSubject typeSubject) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            if (existedLecturer != null) {
                List<EvaluationCriteria> evaluationCriteriaList = evaluationCriteriaRepository.getEvaluationCriteriaByTypeSubjectAndCriteriaId(typeSubject, existedLecturer.getMajor());
                return new ResponseEntity<>(evaluationCriteriaList,HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //GVHD DUYỆT ĐỀ TÀI QUA TRƯỞNG BỘ MÔN

    //Lấy ra danh sách đề tài của GV này có status=true, active=5, type subject = typSubject
    public ResponseEntity<?> getListOfSubjectHaveReportOneHundred(String authorizationHeader, TypeSubject typeSubject){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            List<Subject> existedSubjects = subjectRepository.findSubjectByInstructorAndStatusAndActiveAndTypeSubject(existedLecturer,true,typeSubject,(byte)5);
            System.out.println("Ds đề tài: " + existedSubjects);
            return new ResponseEntity<>(existedSubjects, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //Duyệt đề tài qua GVPB - TIỂU LUẬN CHUYÊN NGHÀNH
    @Transactional
    public ResponseEntity<?> BrowseMoveToThesisAdvisorEssay(int id,@RequestHeader("Authorization") String authorizationHeader) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            if (existedSubject != null) {
                if (existedSubject.getThesisAdvisorId() != null) {
                    //Set active của đề tài
                    existedSubject.setActive((byte) 6);
                    subjectRepository.save(existedSubject);
                    //Gửi mail
                    String subject = "Topic: " + existedSubject.getSubjectName();
                    String messenger = "Topic: " + existedSubject.getSubjectName() + " đã được " + existedSubject.getInstructorId().getPerson().getFirstName() + " " + existedSubject.getInstructorId().getPerson().getLastName() + " duyệt là hoàn thành, truy cập website để xem chi tiết";
                    List<String> emailPerson = new ArrayList<>();
                    Authority authority = authorityRepository.findByName("ROLE_HEAD");
                    Lecturer head = lecturerRepository.getLecturerISHead(authority,existedSubject.getInstructorId().getMajor());
                    emailPerson.add(head.getPerson().getUsername());
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
                    if (!emailPerson.isEmpty()){
                        mailService.sendMailToPerson(emailPerson,subject,messenger);
                    }
                    return new ResponseEntity<>(existedSubject, HttpStatus.OK);
                }else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    public ResponseEntity<?> RefuseTheSubject(int id,@RequestHeader("Authorization") String authorizationHeader,String reason) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            if (existedSubject != null) {
                existedSubject.setActive((byte) 4);
                subjectRepository.save(existedSubject);
                String subject = "Topic: " + existedSubject.getSubjectName();
                String messenger = "Topic: " + existedSubject.getSubjectName() + " không được duyệt với lý do "+reason + ", vui lòng chỉnh sửa và nộp lại trong 1 tuần tới! ";
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
                notificationRepository.save(notification);
                return new ResponseEntity<>(existedSubject, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //KHÓA LUẬN TN
    @Transactional
    public ResponseEntity<?> BrowseMoveToHeadGraduation(int id, @RequestHeader("Authorization") String authorizationHeader,
                                                        String reviewContent, String reviewAdvantage, String reviewWeakness,
                                                        Boolean status,String classification, double score) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            if (existedSubject != null) {
                if (existedSubject.getThesisAdvisorId() != null) {
                    //Tạo mới reviewByInstructor
                    ReviewByInstructor reviewByInstructor = new ReviewByInstructor();
                    reviewByInstructor.setSubject(existedSubject);
                    reviewByInstructor.setInstructorId(existedSubject.getInstructorId());
                    reviewByInstructor.setReviewContent(reviewContent);
                    reviewByInstructor.setReviewAdvantage(reviewAdvantage);
                    reviewByInstructor.setReviewWeakness(reviewWeakness);
                    reviewByInstructor.setStatus(status);
                    reviewByInstructor.setClassification(classification);
                    reviewByInstructor.setScore(score);
                    reviewByInstructorRepository.save(reviewByInstructor);
                    existedSubject.getInstructorId().getReviewByInstructors().add(reviewByInstructor);
                    lecturerRepository.save(existedSubject.getInstructorId());
                    if (status) {
                        //Set active của đề tài
                        existedSubject.setActive((byte) 6);
                        subjectRepository.save(existedSubject);
                        //Gửi mail
                        String subject = "Topic: " + existedSubject.getSubjectName();
                        String messenger = "Topic: " + existedSubject.getSubjectName() + " đã được " + existedSubject.getInstructorId().getPerson().getFirstName() + " " + existedSubject.getInstructorId().getPerson().getLastName() + " duyệt là hoàn thành, truy cập website để xem chi tiết, đợi thông báo từ giảng viên phản biện!";
                        List<String> emailPerson = new ArrayList<>();
                        Authority authority = authorityRepository.findByName("ROLE_HEAD");
                        Lecturer head = lecturerRepository.getLecturerISHead(authority, existedSubject.getInstructorId().getMajor());
                        emailPerson.add(head.getPerson().getUsername());
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
                        if (!emailPerson.isEmpty()) {
                            mailService.sendMailToPerson(emailPerson, subject, messenger);
                        }
                        List<Person> personList = new ArrayList<>();
                        for (String s : emailPerson) {
                            Person p = personRepository.findUsername(s);
                            if (p != null) {
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
                                "Điểm: " + reviewByInstructor.getScore() + "\n" +
                                "Xếp  loại: " + reviewByInstructor.getClassification();
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
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }






    //Danh sách đề tài đã hoàn thành (Hội đồng đã đánh giá, chấm điểm)
    public ResponseEntity<?> getListSubjectSuccessful(@RequestHeader("Authorization") String authorizationHeader, TypeSubject typeSubject){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            List<Subject> subjects = subjectRepository.findSubjectByActiveAndInstructorIdAndType((byte)9,existedLecturer,typeSubject);
            return new ResponseEntity<>(subjects,HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //Chi tiết đề tài đã hoàn thành
    public ResponseEntity<Map<String,Object>> getDetailSubjectSuccessful(int id, @RequestHeader("Authorization") String authorizationHeader,TypeSubject typeSubject){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        double score1 = 0;
        double score2 = 0;
        double score3 = 0;
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            Map<String,Object> response = new HashMap<>();
            if (existedSubject!=null) {
                //Tìm review theo subject
                ReviewByInstructor existedReviewInstructor = reviewByInstructorRepository.getReviewByInstructorBySAndSubject(existedSubject);
                ReviewByThesis existedReviewThesis = reviewByThesisRepository.getReviewByThesisBySAndSubject(existedSubject);
                if (existedReviewThesis!=null) {
                    response.put("reviewThesis", existedReviewThesis);
                }
                if (existedReviewInstructor!=null) {
                    response.put("reviewInstructor", existedReviewInstructor);
                }
                response.put("subject",existedSubject);
                if (existedSubject.getStudent1() != null) {
                    Student student1 = studentRepository.findById(existedSubject.getStudent1()).orElse(null);
                    if (Objects.equals(typeSubject.getTypeName(), "Tiểu luận chuyên ngành")) {
                        ResultEssay resultEssay = resultEssayRepository.findResultEssayByStudentAndSubject(student1, existedSubject);
                        List<ScoreEssay> scoreEssays = scoreEssayRepository.getScoreEssayByResultEssay(resultEssay);
                        int countLecturer = scoreEssays.size();
                        for (ScoreEssay s : scoreEssays) {
                            score1 = score1 + s.getScore();
                        }
                        score1 = score1 / countLecturer;
                    } else if (Objects.equals(typeSubject.getTypeName(), "Khóa luận tốt nghiệp")) {
                        ResultGraduation resultGraduation = resultGraduationRepository.findResultGraduationByStudentAndSubject(student1, existedSubject);
                        List<ScoreGraduation> scoreGraduations = scoreGraduationRepository.getScoreGraduationByResultGraduation(resultGraduation);
                        int countLecturer = scoreGraduations.size();
                        double scoreCouncil = 0;
                        for (ScoreGraduation s : scoreGraduations) {
                            scoreCouncil = scoreCouncil + s.getScore();
                        }
                        score1 = scoreCouncil / countLecturer;
                    }
                    response.put("student1",student1);
                    response.put("scoreStudent1",score1);

                }
                if (existedSubject.getStudent2() != null) {
                    Student student2 = studentRepository.findById(existedSubject.getStudent2()).orElse(null);
                    if (Objects.equals(typeSubject.getTypeName(), "Tiểu luận chuyên ngành")) {
                        ResultEssay resultEssay = resultEssayRepository.findResultEssayByStudentAndSubject(student2, existedSubject);
                        List<ScoreEssay> scoreEssays = scoreEssayRepository.getScoreEssayByResultEssay(resultEssay);
                        int countLecturer = scoreEssays.size();
                        for (ScoreEssay s : scoreEssays) {
                            score2 = score2 + s.getScore();
                        }
                        score2 = score2 / countLecturer;
                    } else if (Objects.equals(typeSubject.getTypeName(), "Khóa luận tốt nghiệp")) {
                        ResultGraduation resultGraduation = resultGraduationRepository.findResultGraduationByStudentAndSubject(student2, existedSubject);
                        List<ScoreGraduation> scoreGraduations = scoreGraduationRepository.getScoreGraduationByResultGraduation(resultGraduation);
                        int countLecturer = scoreGraduations.size();
                        double scoreCouncil = 0;
                        for (ScoreGraduation s : scoreGraduations) {
                            scoreCouncil = scoreCouncil + s.getScore();
                        }
                        score3 = scoreCouncil / countLecturer;
                    }
                    response.put("student2",student2);
                    response.put("scoreStudent2",score2);
                }
                if (existedSubject.getStudent3() != null) {
                    Student student3 = studentRepository.findById(existedSubject.getStudent3()).orElse(null);
                    if (Objects.equals(typeSubject.getTypeName(), "Tiểu luận chuyên ngành")) {
                        ResultEssay resultEssay = resultEssayRepository.findResultEssayByStudentAndSubject(student3, existedSubject);
                        List<ScoreEssay> scoreEssays = scoreEssayRepository.getScoreEssayByResultEssay(resultEssay);
                        int countLecturer = scoreEssays.size();
                        for (ScoreEssay s : scoreEssays) {
                            score3 = score3 + s.getScore();
                        }
                        score3 = score3 / countLecturer;
                    } else if (Objects.equals(typeSubject.getTypeName(), "Khóa luận tốt nghiệp")) {
                        ResultGraduation resultGraduation = resultGraduationRepository.findResultGraduationByStudentAndSubject(student3, existedSubject);
                        List<ScoreGraduation> scoreGraduations = scoreGraduationRepository.getScoreGraduationByResultGraduation(resultGraduation);
                        int countLecturer = scoreGraduations.size();
                        double scoreCouncil = 0;
                        for (ScoreGraduation s : scoreGraduations) {
                            scoreCouncil = scoreCouncil + s.getScore();
                        }
                        score3 = scoreCouncil / countLecturer;
                    }
                    response.put("student3",student3);
                    response.put("scoreStudent3",score3);

                }

                return new ResponseEntity<>(response, HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
