package com.web.controller.Student.Graduation;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.*;
import com.web.service.MailServiceImpl;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.*;

@RestController
@RequestMapping("/api/graduation/student/task")
public class StudentAddTaskGraduationController {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private FileRepository fileRepository;
    @Autowired
    private MailServiceImpl mailService;
    private final TokenUtils tokenUtils;
    @Autowired
    public StudentAddTaskGraduationController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }

    @GetMapping("/new")
    public ResponseEntity<Map<String, Object>> getNewTask(@RequestHeader("Authorization") String authorizationHeader) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            //ModelAndView modelAndView = new ModelAndView("student_addTask");
            Student currentStudent = studentRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject currentSubject = subjectRepository.findById(currentStudent.getSubjectGraduationId().getSubjectId()).orElse(null);

            List<Student> studentList = new ArrayList<>();
            if (currentSubject.getStudent1() != null) {
                Student studen1 = studentRepository.findById(currentSubject.getStudent1()).orElse(null);
                studentList.add(studen1);
            }
            if (currentSubject.getStudent2() != null) {
                Student studen2 = studentRepository.findById(currentSubject.getStudent2()).orElse(null);
                studentList.add(studen2);
            }
            Map<String,Object> response = new HashMap<>();
            response.put("student", currentStudent);
            response.put("subject", currentSubject);
            response.put("listStudentGroup", studentList);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Map<String,Object>> getListTask(@RequestHeader("Authorization") String authorizationHeader) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            Student currentStudent = studentRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject currentSubject = subjectRepository.findById(currentStudent.getSubjectGraduationId().getSubjectId()).orElse(null);
            List<Task> taskList = currentSubject.getTasks();
            Map<String,Object> response = new HashMap<>();
            response.put("listTask", taskList);
            response.put("peson", personCurrent);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


    @PostMapping("/create")
    public ResponseEntity<?> createTask(@RequestHeader("Authorization") String authorizationHeader,
                                   @RequestParam("requirement") String requirement,
                                   @RequestParam("timeStart") Date timeStart,
                                   @RequestParam("timeEnd") Date timeEnd,
                                   @RequestParam("assignTo") String assignTo) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        System.out.println("Requirement: " + requirement);
        if (personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            Student currentStudent = studentRepository.findById(personCurrent.getPersonId()).orElse(null);
            Subject currentSubject = subjectRepository.findById(currentStudent.getSubjectGraduationId().getSubjectId()).orElse(null);
            Task newTask = new Task();
            List<Task> listTask = new ArrayList<>();
            newTask.setCreateBy(personCurrent);
            newTask.setInstructorId(currentStudent.getSubjectGraduationId().getInstructorId());
            newTask.setRequirement(requirement);
            newTask.setSubjectId(currentStudent.getSubjectGraduationId());
            newTask.setTimeStart(timeStart);
            newTask.setTimeEnd(timeEnd);

            // Lấy thông tin sinh viên được chọn từ danh sách sinh viên
            Student existStudent = studentRepository.findById(assignTo).orElse(null);
            newTask.setAssignTo(existStudent);
            newTask.setStatus("MustDo");
            var task = taskRepository.save(newTask);
            listTask.add(task);
            currentSubject.setTasks(listTask);
            return new ResponseEntity<>(task, HttpStatus.CREATED);

        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    // Phương thức để lấy danh sách sinh viên cho việc tạo task
    private List<Student> getStudentListForTaskCreation(Subject currentSubject) {
        List<Student> studentList = new ArrayList<>();
        if (currentSubject.getStudent1() != null) {
            Student studen1 = studentRepository.findById(currentSubject.getStudent1()).orElse(null);
            studentList.add(studen1);
        }
        if (currentSubject.getStudent2() != null) {
            Student studen2 = studentRepository.findById(currentSubject.getStudent2()).orElse(null);
            studentList.add(studen2);
        }
        return studentList;
    }

    @PostMapping("/updateStatus/{id}")
    public ResponseEntity<?> updateStatus(@RequestHeader("Authorization") String authorizationHeader, @PathVariable int id,@RequestParam String selectedOption) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            Task existTask = taskRepository.findById(id).orElse(null);
            if (existTask!=null){
                Subject existSubject = subjectRepository.findById(existTask.getSubjectId().getSubjectId()).orElse(null);
                existTask.setStatus(selectedOption);
                taskRepository.save(existTask);
                MailStructure newMail = new MailStructure();
                String subject = "Change status task " + existTask.getRequirement() ;
                String messenger = "Topic: " + existSubject.getSubjectName()+"\n" +
                        "Change by: " + personCurrent.getUsername() + "\n"
                        + "Change status task " + existTask.getRequirement() + " to " + selectedOption;
                newMail.setSubject(subject);
                newMail.setSubject(messenger);
                if (personCurrent.getPersonId().equals(existSubject.getStudent1())) {
                    if (existSubject.getStudent2()!=null) {
                        Student studen2 = studentRepository.findById(existSubject.getStudent2()).orElse(null);
                        mailService.sendMail(studen2.getPerson().getUsername(), existSubject.getInstructorId().getPerson().getUsername(), subject, messenger);
                    }else {
                        mailService.sendMailNull(existSubject.getInstructorId().getPerson().getUsername(),subject,messenger);
                    }
                }else {
                    if (existSubject.getStudent1()!=null) {
                        Student studen1 = studentRepository.findById(existSubject.getStudent1()).orElse(null);
                        mailService.sendMail(studen1.getPerson().getUsername(), existSubject.getInstructorId().getPerson().getUsername(), subject, messenger);
                    }else {
                        mailService.sendMailNull(existSubject.getInstructorId().getPerson().getUsername(),subject,messenger);
                    }
                }
            }
            return new ResponseEntity<>(existTask,HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


    @GetMapping("/detail/{taskId}")
    public ResponseEntity<Map<String,Object>> getDetail(@RequestHeader("Authorization") String authorizationHeader, @PathVariable int taskId){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            //ModelAndView modelAndView = new ModelAndView("student_detailTask");
            Task currentTask = taskRepository.findById(taskId).orElse(null);
            List<String> options = Arrays.asList("MustDo", "Doing", "Closed");
            List<FileComment> fileCommentList = fileRepository.findAllByTask(currentTask);
            List<Comment> commentList = currentTask.getComments();

            Map<String,Object> response = new HashMap<>();
            response.put("person", personCurrent);
            response.put("task", currentTask);
            response.put("listFile", fileCommentList);
            response.put("listComment", commentList);
            response.put("options", options);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}