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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestHeader;

import java.time.LocalDate;
import java.util.*;

@Service
public class ManageTutorialSubjectService {
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private AuthorityRepository authorityRepository;
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
    @Autowired
    private ResultEssayRepository resultEssayRepository;
    @Autowired
    private EvaluationCriteriaRepository evaluationCriteriaRepository;
    @Autowired
    private ResultGraduationRepository resultGraduationRepository;

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

                List<String> emailPerson = new ArrayList<>();
                if (newSubject.getStudent1()!=null) {
                    Student student1 = studentRepository.findById(newSubject.getStudent1()).orElse(null);
                    if (student1.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                        emailPerson.add(student1.getPerson().getUsername());
                    }
                }
                if (newSubject.getStudent2()!=null) {
                    Student student2 = studentRepository.findById(newSubject.getStudent2()).orElse(null);
                    if (student2.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                        emailPerson.add(student2.getPerson().getUsername());
                    }
                }
                if (newSubject.getStudent3()!=null) {
                    Student student3 = studentRepository.findById(newSubject.getStudent3()).orElse(null);
                    if (student3.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                        emailPerson.add(student3.getPerson().getUsername());
                    }
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
                List<String> emailPerson = new ArrayList<>();
                if (newSubject.getStudent1()!=null) {
                    Student student1 = studentRepository.findById(newSubject.getStudent1()).orElse(null);
                    if (student1.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                        emailPerson.add(student1.getPerson().getUsername());
                    }
                }
                if (newSubject.getStudent2()!=null) {
                    Student student2 = studentRepository.findById(newSubject.getStudent2()).orElse(null);
                    if (student2.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                        emailPerson.add(student2.getPerson().getUsername());
                    }
                }
                if (newSubject.getStudent3()!=null) {
                    Student student3 = studentRepository.findById(newSubject.getStudent3()).orElse(null);
                    if (student3.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                        emailPerson.add(student3.getPerson().getUsername());
                    }
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

                List<String> emailPerson = new ArrayList<>();
                if (newSubject.getStudent1()!=null) {
                    Student student1 = studentRepository.findById(newSubject.getStudent1()).orElse(null);
                    if (student1.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                        emailPerson.add(student1.getPerson().getUsername());
                    }
                }
                if (newSubject.getStudent2()!=null) {
                    Student student2 = studentRepository.findById(newSubject.getStudent2()).orElse(null);
                    if (student2.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                        emailPerson.add(student2.getPerson().getUsername());
                    }
                }
                if (newSubject.getStudent3()!=null) {
                    Student student3 = studentRepository.findById(newSubject.getStudent3()).orElse(null);
                    if (student3.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                        emailPerson.add(student3.getPerson().getUsername());
                    }
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
                List<String> emailPerson = new ArrayList<>();
                if (newSubject.getStudent1()!=null) {
                    Student student1 = studentRepository.findById(newSubject.getStudent1()).orElse(null);
                    if (student1.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                        emailPerson.add(student1.getPerson().getUsername());
                    }
                }
                if (newSubject.getStudent2()!=null) {
                    Student student2 = studentRepository.findById(newSubject.getStudent2()).orElse(null);
                    if (student2.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                        emailPerson.add(student2.getPerson().getUsername());
                    }
                }
                if (newSubject.getStudent3()!=null) {
                    Student student3 = studentRepository.findById(newSubject.getStudent3()).orElse(null);
                    if (student3.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                        emailPerson.add(student3.getPerson().getUsername());
                    }
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
    public ResponseEntity<?> BrowseMoveToThesisAdvisorGraduation(int id,@RequestHeader("Authorization") String authorizationHeader) {
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
                    String messenger = "Topic: " + existedSubject.getSubjectName() + " đã được " + existedSubject.getInstructorId().getPerson().getFirstName() + " " + existedSubject.getInstructorId().getPerson().getLastName() + " duyệt là hoàn thành, truy cập website để xem chi tiết!";
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
    public ResponseEntity<?> getDetailSubjectSuccessful(int id, @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            return new ResponseEntity<>(existedSubject,HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }



}
