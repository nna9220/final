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
import com.web.service.Lecturer.LecturerSubjectService;
import com.web.service.SubjectImplService;
import com.web.utils.UserUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lecturer/subjectGraduation")
public class LecturerRegisterGraduationTopicController {

    @Autowired
    private SubjectImplService service;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
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
    private StudentService studentService;
    @Autowired
    private LecturerSubjectService lecturerSubjectService;
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

    private final TokenUtils tokenUtils;
    @Autowired
    public LecturerRegisterGraduationTopicController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }

    //Xóa đề tài
    @GetMapping("/delete")
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

    @GetMapping
    public ResponseEntity<Map<String,Object>> getQuanLyDeTai(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
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


    //Đăng ký đề tài
    @PostMapping("/register")
    public ResponseEntity<?> lecturerRegisterTopic(@RequestParam("subjectName") String name,
                                              @RequestParam("requirement") String requirement,
                                              @RequestParam("expected") String expected,
                                              @RequestParam("typeSubject") TypeSubject typeSubject,
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
            if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD") ) {
                List<RegistrationPeriodLectuer> periodList = registrationPeriodLecturerRepository.findAllPeriod();
                if (CompareTime.isCurrentTimeInPeriodSLecturer(periodList)) {
                    Subject newSubject = new Subject();
                    newSubject.setSubjectName(name);
                    newSubject.setRequirement(requirement);
                    newSubject.setExpected(expected);
                    newSubject.setActive((byte) 1);
                    newSubject.setStatus(false);
                    //Tìm kiếm giảng viên hiện tại
                    Lecturer existLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
                    newSubject.setInstructorId(existLecturer);
                    newSubject.setMajor(existLecturer.getMajor());
                    //Tìm sinh viên qua mã sinh viên
                    Student studentId1 = studentRepository.findById(student1).orElse(null);
                    Student studentId2 = studentRepository.findById(student2).orElse(null);
                    Student studentId3 = studentRepository.findById(student3).orElse(null);
                    if (studentId1 != null) {
                        newSubject.setStudent1(student1);
                        studentId1.setSubjectId(newSubject);
                    }
                    if (studentId2 != null) {
                        newSubject.setStudent2(student2);
                        studentId2.setSubjectId(newSubject);
                    }
                    if (studentId3 != null) {
                        newSubject.setStudent3(student3);
                        studentId3.setSubjectId(newSubject);
                    }
                    LocalDate nowDate = LocalDate.now();
                    newSubject.setYear(String.valueOf(nowDate));
                    newSubject.setTypeSubject(typeSubject);
                    subjectRepository.save(newSubject);
                    studentRepository.save(studentId1);
                    studentRepository.save(studentId2);
                    studentRepository.save(studentId3);

                    return new ResponseEntity<>(newSubject,HttpStatus.CREATED);
                }else {
                    return new ResponseEntity<>(personCurrent,HttpStatus.OK);
                }
            }
            else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }


    //Quản lý đề tài
    @GetMapping("/listTask/{subjectId}")
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
    public ResponseEntity<?> importSubject(@RequestHeader("Authorization") String authorizationHeader, @RequestParam("file") MultipartFile file, HttpSession session) throws IOException {
        service.importSubject(file,authorizationHeader);
        /*String referer = Contains.URL +  "/api/lecturer/subject";
        return new ModelAndView("redirect:" + referer);*/
        return new ResponseEntity<>(service.importSubject(file,authorizationHeader),HttpStatus.OK);
    }
}