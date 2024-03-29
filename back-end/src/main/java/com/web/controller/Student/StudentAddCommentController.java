package com.web.controller.Student;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.*;
import com.web.service.FileMaterialService;
import com.web.service.MailServiceImpl;
import com.web.utils.Contains;
import com.web.utils.UserUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/student/comment")
public class StudentAddCommentController {
    private static final Logger logger = LoggerFactory.getLogger(StudentAddCommentController.class);
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private FileMaterialService fileMaterialService;
    @Autowired
    private MailServiceImpl mailService;

    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private FileRepository fileRepository;

    private final TokenUtils tokenUtils;
    @Autowired
    public StudentAddCommentController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }
    @PostMapping("/create/{taskId}")
    public ResponseEntity<?> createComment(@PathVariable int taskId,
                                      @RequestParam("content") String content,
                                      @RequestParam("fileInput") List<MultipartFile> files,
                                      @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            Comment newComment = new Comment();
            newComment.setContent(content);
            newComment.setPoster(personCurrent);
            Task existTask = taskRepository.findById(taskId).orElse(null);
            Subject existSubject = subjectRepository.findById(existTask.getSubjectId().getSubjectId()).orElse(null);
            newComment.setTaskId(existTask);
            LocalDateTime nowDate = LocalDateTime.now();
            Date dateSubmit = Date.from(nowDate.atZone(ZoneId.systemDefault()).toInstant());
            newComment.setDateSubmit(dateSubmit);
            var comment = commentRepository.save(newComment);
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String fileName = fileMaterialService.storeFile(file);
                        FileComment newFile = new FileComment();
                        newFile.setName(fileName);
                        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                                .path("/api/student/comment/fileUpload/")
                                .path(fileName)
                                .toUriString();
                        newFile.setUrl(fileDownloadUri);
                        newFile.setCommentId(comment);
                        newFile.setTaskId(comment.getTaskId());
                        var fileSave = fileMaterialService.uploadFile(newFile);
                        List<FileComment> fileList = comment.getFileComments();
                        if (fileList == null) {
                            fileList = new ArrayList<>();
                        }
                        fileList.add(fileSave);
                        comment.setFileComments(fileList);
                        commentRepository.save(comment);
                    }
                }
            }
            MailStructure newMail = new MailStructure();
            String subject = "Change task " + existTask.getRequirement() ;
            String messenger = "Topic: " + existSubject.getSubjectName()+"\n" +
                    "Change by: " + personCurrent.getUsername() + "\n"
                    + "Change task: " + existTask.getRequirement()+"\n"
                    + "Content: " + comment.getContent();
            newMail.setSubject(subject);
            newMail.setSubject(messenger);
            if (personCurrent.getPersonId().equals(existSubject.getStudentId1().getStudentId())) {
                if (existSubject.getStudentId2()!=null) {
                    mailService.sendMail(existSubject.getStudentId2().getPerson().getUsername(), existSubject.getInstructorId().getPerson().getUsername(), subject, messenger);
                }else {
                    mailService.sendMailNull(existSubject.getInstructorId().getPerson().getUsername(),subject,messenger);
                }
            }else {
                if (existSubject.getStudentId1()!=null) {
                    mailService.sendMail(existSubject.getStudentId1().getPerson().getUsername(), existSubject.getInstructorId().getPerson().getUsername(), subject, messenger);
                }else {
                    mailService.sendMailNull(existSubject.getInstructorId().getPerson().getUsername(),subject,messenger);
                }
            }
            /*String referer = Contains.URL_LOCAL + "/api/student/task/detail/" + taskId;
            return new ModelAndView("redirect:"+referer);*/
            return new ResponseEntity<>(existTask, HttpStatus.OK);
        }else{
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/fileUpload/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        // Load file as Resource
        Resource resource =fileMaterialService.loadFileAsResource(fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}