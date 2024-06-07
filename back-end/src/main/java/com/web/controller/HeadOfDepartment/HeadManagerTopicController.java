package com.web.controller.HeadOfDepartment;


import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.controller.admin.LecturerController;
import com.web.entity.*;
import com.web.mapper.SubjectMapper;
import com.web.repository.*;
import com.web.service.Admin.StudentService;
import com.web.service.Admin.SubjectService;
import com.web.service.Lecturer.LecturerAddScoreGraduationService;
import com.web.utils.UserUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    private TypeSubjectRepository typeSubjectRepository;
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
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<Map<String,Object>> getQuanLyDeTai(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            List<Subject> subjectByCurrentLecturer = subjectRepository.findSubjectByLecturerIntro(existedLecturer, true, typeSubject);

            Map<String,Object> response = new HashMap<>();
            response.put("person", personCurrent);
            response.put("listSubject",subjectByCurrentLecturer);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/listTask/{subjectId}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<Map<String,Object>> getListTask(@RequestHeader("Authorization") String authorizationHeader, @PathVariable int subjectId){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer currentLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject currentSubject = subjectRepository.findById(subjectId).orElse(null);
            List<Task> taskList = currentSubject.getTasks();
            Map<String ,Object> response = new HashMap<>();
            response.put("person",personCurrent);
            response.put("listTask",taskList);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/detail/{taskId}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
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
}
