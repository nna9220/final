package com.web.controller.HeadOfDepartment;


import antlr.Token;
import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.controller.admin.LecturerController;
import com.web.entity.*;
import com.web.mapper.SubjectMapper;
import com.web.repository.*;
import com.web.service.Admin.StudentService;
import com.web.service.Admin.SubjectService;
import com.web.service.Lecturer.LecturerSubjectService;
import com.web.utils.UserUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/head/manager")
public class HeadManagerTopicController {
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
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    private static final Logger logger = LoggerFactory.getLogger(LecturerController.class);
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private RegistrationPeriodRepository registrationPeriodRepository;

    private final TokenUtils tokenUtils;
    @Autowired
    public HeadManagerTopicController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }
    @GetMapping
    public ResponseEntity<Map<String,Object>> getQuanLyDeTai(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            //ModelAndView model = new ModelAndView("QuanLyDeTai_TBM");
            List<Subject> subjectByCurrentLecturer = subjectRepository.findSubjectByLecturerIntro(existedLecturer, true);
            /*model.addObject("listSubject",subjectByCurrentLecturer);
            model.addObject("person", personCurrent);
            return model;*/
            Map<String,Object> response = new HashMap<>();
            response.put("person", personCurrent);
            response.put("listSubject",subjectByCurrentLecturer);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/listTask/{subjectId}")
    public ResponseEntity<Map<String,Object>> getListTask(@RequestHeader("Authorization") String authorizationHeader, @PathVariable int subjectId){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            /*ModelAndView modelAndView = new ModelAndView("head_listTask");*/
            Lecturer currentLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject currentSubject = subjectRepository.findById(subjectId).orElse(null);
            List<Task> taskList = currentSubject.getTasks();
            /*modelAndView.addObject("listTask",taskList);
            modelAndView.addObject("person", personCurrent);
            return modelAndView;*/
            Map<String ,Object> response = new HashMap<>();
            response.put("person",personCurrent);
            response.put("listTask",taskList);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else{
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/detail/{taskId}")
    public ResponseEntity<Map<String,Object>> getDetail(@RequestHeader("Authorization") String authorizationHeader, @PathVariable int taskId){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            /*ModelAndView modelAndView = new ModelAndView("head_detailTask");*/
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
}
