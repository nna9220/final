package com.web.controller.Lecturer;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;
import com.web.config.CheckRole;
import com.web.config.CompareTime;
import com.web.config.TokenUtils;
import com.web.controller.admin.LecturerController;
import com.web.entity.*;
import com.web.mapper.SubjectMapper;
import com.web.repository.*;
import com.web.service.Admin.StudentService;
import com.web.service.Admin.SubjectService;
import com.web.service.Lecturer.LecturerAddScoreGraduationService;
import com.web.service.MailServiceImpl;
import com.web.service.SubjectImplService;
import com.web.utils.UserUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/lecturer/subject")
public class LecturerRegisterTopicController {

    @Autowired
    private SubjectImplService service;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private FileRepository fileRepository;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private SubjectService subjectService;
    @Autowired
    private SubjectMapper subjectMapper;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private StudentService studentService;
    @Autowired
    private LecturerAddScoreGraduationService lecturerSubjectService;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private RegistrationPeriodLecturerRepository registrationPeriodLecturerRepository;
    private static final Logger logger = LoggerFactory.getLogger(LecturerController.class);
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private RegistrationPeriodRepository registrationPeriodRepository;
    @Autowired
    private EvaluationCriteriaRepository evaluationCriteriaRepository;

    private final TokenUtils tokenUtils;
    @Autowired
    public LecturerRegisterTopicController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }

    @GetMapping("/delete")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<Map<String, Object>> getDanhSachDeTaiDaXoa(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            List<Subject> subjectByCurrentLecturer = subjectRepository.findSubjectByStatusAndMajorAndActive(false,existedLecturer.getMajor(),(byte) 0,typeSubject);
            Map<String,Object> response = new HashMap<>();
            response.put("person", personCurrent);
            response.put("listSubject",subjectByCurrentLecturer);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<Map<String,Object>> getQuanLyDeTai(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            List<Subject> subjectByCurrentLecturer = subjectRepository.findSubjectByLecturerIntro(existedLecturer, true,typeSubject);
            /*model.addObject("listSubject",subjectByCurrentLecturer);
            model.addObject("person", personCurrent);
            return model;*/
            Map<String,Object> response = new HashMap<>();
            response.put("person", personCurrent);
            response.put("listSubject",subjectByCurrentLecturer);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
           /* ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/listStudent")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> getListStudent(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD") ) {
            List<Student> studentList = studentRepository.getStudentSubjectNull();
            return new ResponseEntity<>(studentList, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/periodLecturer")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> getPeriod(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD") ) {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            List<RegistrationPeriodLectuer> registrationPeriods = registrationPeriodLecturerRepository.findAllPeriodEssay(typeSubject);
            return new ResponseEntity<>(registrationPeriods, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/register")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> lecturerRegisterTopic(
            @RequestParam("subjectName") String name,
            @RequestParam("requirement") String requirement,
            @RequestParam("expected") String expected,
            @RequestParam(value = "student1", required = false) String student1,
            @RequestParam(value = "student2", required = false) String student2,
            @RequestParam(value = "student3", required = false) String student3,
            @RequestHeader("Authorization") String authorizationHeader,
            HttpServletRequest request) {
        try {
            LocalDateTime current = LocalDateTime.now();
            System.out.println("Current time: " + current);
            String token = tokenUtils.extractToken(authorizationHeader);
            Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
            System.out.println("Current person: " + personCurrent);

            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            System.out.println("TypeSubject: " + typeSubject);

            if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") ||
                    personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {

                List<RegistrationPeriodLectuer> periodList = registrationPeriodLecturerRepository.findAllPeriodEssay(typeSubject);
                System.out.println("Period list: " + periodList);

                if (CompareTime.isCurrentTimeInPeriodSLecturer(periodList)) {
                    Subject newSubject = new Subject();
                    newSubject.setSubjectName(name);
                    newSubject.setRequirement(requirement);
                    newSubject.setExpected(expected);
                    newSubject.setActive((byte) 0);
                    newSubject.setStatus(false);

                    Lecturer existLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
                    System.out.println("Exist lecturer: " + existLecturer);

                    if (existLecturer != null) {
                        newSubject.setInstructorId(existLecturer);
                        newSubject.setMajor(existLecturer.getMajor());

                        List<Student> studentList = new ArrayList<>();
                        if (student1 != null) {
                            Student studentId1 = studentRepository.findById(student1).orElse(null);
                            if (studentId1 != null) {
                                newSubject.setStudent1(student1);
                                studentId1.setSubjectId(newSubject);
                                studentList.add(studentId1);
                            }
                        }

                        if (student2 != null) {
                            Student studentId2 = studentRepository.findById(student2).orElse(null);
                            if (studentId2 != null) {
                                newSubject.setStudent2(student2);
                                studentId2.setSubjectId(newSubject);
                                studentList.add(studentId2);
                            }
                        }

                        if (student3 != null) {
                            Student studentId3 = studentRepository.findById(student3).orElse(null);
                            if (studentId3 != null) {
                                newSubject.setStudent3(student3);
                                studentId3.setSubjectId(newSubject);
                                studentList.add(studentId3);
                            }
                        }
                        Set<EvaluationCriteria> evaluationCriteria = evaluationCriteriaRepository.getEvaluationCriteriaByTypeSubject(typeSubject);
                        if (evaluationCriteria!=null){
                            newSubject.setCriteria(evaluationCriteria);
                        }
                        newSubject.setCheckStudent(student1 != null || student2 != null || student3 != null);
                        LocalDate nowDate = LocalDate.now();
                        newSubject.setYear(String.valueOf(nowDate));
                        newSubject.setTypeSubject(typeSubject);

                        subjectRepository.save(newSubject);
                        studentRepository.saveAll(studentList);
                        String subject = "ĐĂNG KÝ ĐỀ TÀI THÀNH CÔNG";
                        String messenger = "Topic: " + newSubject.getSubjectName() + " đăng ký thành công!!";
                        //Gửi mail cho Hội đồng - SV
                        List<String> emailPerson = new ArrayList<>();
                        emailPerson.add(existLecturer.getPerson().getUsername());
                        mailService.sendMailToPerson(emailPerson,subject,messenger);
                        return new ResponseEntity<>(newSubject, HttpStatus.CREATED);
                    } else {
                        return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Lecturer không tồn tại
                    }
                } else {
                    return new ResponseEntity<>(HttpStatus.OK); // Thời gian không hợp lệ
                }
            } else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Không đủ quyền
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }


    @GetMapping("/listTask/{subjectId}")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<Map<String,Object>> getListTask(@RequestHeader("Authorization") String authorizationHeader, @PathVariable int subjectId){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            //ModelAndView modelAndView = new ModelAndView("lecturer_listTask");
            Lecturer currentLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject currentSubject = subjectRepository.findById(subjectId).orElse(null);
            List<Task> taskList = currentSubject.getTasks();

            Map<String,Object> response = new HashMap<>();
            response.put("listTask",taskList);
            response.put("person", personCurrent);
            response.put("lec",currentLecturer);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/detail/{taskId}")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<Map<String,Object>> getDetail(@RequestHeader("Authorization") String authorizationHeader, @PathVariable int taskId){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Task currentTask = taskRepository.findById(taskId).orElse(null);
            List<FileComment> fileCommentList = fileRepository.findAllByTask(currentTask);
            List<Comment> commentList = currentTask.getComments();
            Map<String,Object> response = new HashMap<>();
            response.put("task",currentTask);
            response.put("person", personCurrent);
            response.put("listFile",fileCommentList);
            response.put("listComment",commentList);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/import")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> importSubject(@RequestHeader("Authorization") String authorizationHeader, @RequestParam("file") MultipartFile file, HttpSession session) throws IOException {
        service.importSubject(file,authorizationHeader);
        return new ResponseEntity<>(service.importSubject(file,authorizationHeader),HttpStatus.OK);
    }
}
