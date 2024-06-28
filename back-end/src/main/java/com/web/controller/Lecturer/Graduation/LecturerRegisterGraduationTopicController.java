package com.web.controller.Lecturer.Graduation;

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
@RequestMapping("/api/lecturer/subjectGraduation")
public class LecturerRegisterGraduationTopicController {

    @Autowired
    private SubjectImplService service;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private FileRepository fileRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private SubjectService subjectService;
    @Autowired
    private SubjectMapper subjectMapper;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private LecturerAddScoreGraduationService lecturerSubjectService;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private EvaluationCriteriaRepository evaluationCriteriaRepository;
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

    private final TokenUtils tokenUtils;
    @Autowired
    public LecturerRegisterGraduationTopicController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }

    //Xóa đề tài
    @GetMapping("/delete")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<Map<String, Object>> getDanhSachDeTaiDaXoa(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
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


    //Danh sách đề tài
    @GetMapping("/listStudent")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> getStudentsSameMajor(@RequestHeader("Authorization") String authorizationHeader) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            if (existedLecturer != null) {
                Major major = existedLecturer.getMajor();
                List<Student> studentsSameMajor = studentRepository.findStudentsByMajorAndNoSubjectForKL(major);
                return new ResponseEntity<>(studentsSameMajor, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Lecturer không tồn tại
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Không đủ quyền
        }
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<Map<String,Object>> getQuanLyDeTai(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            List<Subject> subjectByCurrentLecturer = subjectRepository.findSubjectByLecturerIntro(existedLecturer, true,typeSubject);
            Map<String,Object> response = new HashMap<>();
            response.put("person", personCurrent);
            response.put("listSubject",subjectByCurrentLecturer);
            return new ResponseEntity<>(response,HttpStatus.OK);
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
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            List<RegistrationPeriodLectuer> registrationPeriods = registrationPeriodLecturerRepository.findAllPeriodEssay(typeSubject);
            return new ResponseEntity<>(registrationPeriods, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //Đăng ký đề tài
    @PostMapping("/register")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> lecturerRegisterTopic(@RequestParam("subjectName") String name,
                                                   @RequestParam("requirement") String requirement,
                                                   @RequestParam("expected") String expected,
                                                   @RequestParam(value = "student1", required = false) String student1,
                                                   @RequestParam(value = "student2", required = false) String student2,
                                                   @RequestParam(value = "student3", required = false) String student3,
                                                   @RequestHeader("Authorization") String authorizationHeader,
                                                   HttpServletRequest request) {
        try {
            LocalDateTime current = LocalDateTime.now();
            System.out.println(current);
            String token = tokenUtils.extractToken(authorizationHeader);
            Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            System.out.println("Trước if check role");
            if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD") ) {
                System.out.println("Sau if check role");
                List<RegistrationPeriodLectuer> periodList = registrationPeriodLecturerRepository.findAllPeriodEssay(typeSubject);
                System.out.println("check time: " + CompareTime.isCurrentTimeInPeriodSLecturer(periodList));
                System.out.println("period 1: " + periodList);
                if (CompareTime.isCurrentTimeInPeriodSLecturer(periodList)) {
                    System.out.println("Sau if check time");
                    // Kiểm tra sinh viên trùng
                    Set<String> studentSet = new HashSet<>();
                    if (student1 != null) {
                        if (!studentSet.add(student1)) {
                            return new ResponseEntity<>("Sinh viên 1 đã đăng ký", HttpStatus.BAD_REQUEST);
                        }
                    }
                    if (student2 != null) {
                        if (!studentSet.add(student2)) {
                            return new ResponseEntity<>("Sinh viên 2 đã đăng ký", HttpStatus.BAD_REQUEST);
                        }
                    }
                    if (student3 != null) {
                        if (!studentSet.add(student3)) {
                            return new ResponseEntity<>("Sinh viên 3 đã đăng ký", HttpStatus.BAD_REQUEST);
                        }
                    }

                    Subject newSubject = new Subject();
                    newSubject.setSubjectName(name);
                    newSubject.setRequirement(requirement);
                    newSubject.setExpected(expected);
                    newSubject.setActive((byte) 0);
                    newSubject.setStatus(false);
                    // Tìm kiếm giảng viên hiện tại
                    System.out.println("Trước tìm gv");
                    Lecturer existLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
                    newSubject.setInstructorId(existLecturer);
                    newSubject.setMajor(existLecturer.getMajor());
                    // Tìm sinh viên qua mã sinh viên
                    List<Student> studentList = new ArrayList<>();
                    System.out.println("Trước if check sv1");
                    if (student1 != null) {
                        Student studentId1 = studentRepository.findById(student1).orElse(null);
                        newSubject.setStudent1(student1);
                        studentId1.setSubjectGraduationId(newSubject);
                        studentList.add(studentId1);
                        System.out.println("Sau if check sv1");
                    }
                    System.out.println("Trước if check sv2");
                    if (student2 != null) {
                        Student studentId2 = studentRepository.findById(student2).orElse(null);
                        newSubject.setStudent2(student2);
                        studentId2.setSubjectGraduationId(newSubject);
                        studentList.add(studentId2);
                        System.out.println("Sau if check sv2");
                    }
                    System.out.println("Trước if check sv3");
                    if (student3 != null) {
                        Student studentId3 = studentRepository.findById(student3).orElse(null);
                        newSubject.setStudent3(student3);
                        studentId3.setSubjectGraduationId(newSubject);
                        System.out.println("Sau if check sv3");
                        studentList.add(studentId3);
                    }
                    if (student1 == null && student2 == null && student3 == null) {
                        newSubject.setCheckStudent(false);
                    } else {
                        newSubject.setCheckStudent(true);
                    }
                    Set<EvaluationCriteria> evaluationCriteria = evaluationCriteriaRepository.getEvaluationCriteriaByTypeSubject(typeSubject);
                    if (evaluationCriteria != null) {
                        newSubject.setCriteria(evaluationCriteria);
                    }
                    LocalDate nowDate = LocalDate.now();
                    newSubject.setYear(String.valueOf(nowDate));
                    newSubject.setTypeSubject(typeSubject);
                    subjectRepository.save(newSubject);
                    studentRepository.saveAll(studentList);
                    String subject = "ĐĂNG KÝ ĐỀ TÀI THÀNH CÔNG";
                    String messenger = "Topic: " + newSubject.getSubjectName() + " đăng ký thành công - VUi lòng chờ TBM duyệt đề tài";
                    // Gửi mail cho Hội đồng - SV
                    List<String> emailPerson = new ArrayList<>();
                    emailPerson.add(existLecturer.getPerson().getUsername());
                    mailService.sendMailToPerson(emailPerson, subject, messenger);
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
                    notificationRepository.save(notification);
                    return new ResponseEntity<>(newSubject, HttpStatus.CREATED);
                } else {
                    return new ResponseEntity<>(personCurrent, HttpStatus.OK);
                }
            } else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    //Quản lý đề tài
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
            /*modelAndView.addObject("listTask",taskList);
            modelAndView.addObject("person", personCurrent);
            return modelAndView;*/
            Map<String,Object> response = new HashMap<>();
            response.put("listTask",taskList);
            response.put("person", personCurrent);
            response.put("lec",currentLecturer);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else{
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //Chi tiết task

    @GetMapping("/detail/{taskId}")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<Map<String,Object>> getDetail(@RequestHeader("Authorization") String authorizationHeader, @PathVariable int taskId){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            /*ModelAndView modelAndView = new ModelAndView("lecturer_detailTask");*/
            Task currentTask = taskRepository.findById(taskId).orElse(null);
            List<FileComment> fileCommentList = fileRepository.findAllByTask(currentTask);
            List<Comment> commentList = currentTask.getComments();
            /*modelAndView.addObject("task", currentTask);
            modelAndView.addObject("person", personCurrent);
            modelAndView.addObject("listFile", fileCommentList);
            modelAndView.addObject("listComment", commentList);
            return modelAndView;*/
            Map<String,Object> response = new HashMap<>();
            response.put("task",currentTask);
            response.put("person", personCurrent);
            response.put("listFile",fileCommentList);
            response.put("listComment",commentList);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else{
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    //Import đề tài bằng excel

    @PostMapping("/import")
    @PreAuthorize("hasAuthority('ROLE_LECTURER')")
    public ResponseEntity<?> importSubject(@RequestHeader("Authorization") String authorizationHeader, @RequestParam("file") MultipartFile file, HttpSession session) throws IOException {
        service.importSubject(file,authorizationHeader);
        /*String referer = Contains.URL +  "/api/lecturer/subject";
        return new ModelAndView("redirect:" + referer);*/
        return new ResponseEntity<>(service.importSubject(file,authorizationHeader),HttpStatus.OK);
    }
}
