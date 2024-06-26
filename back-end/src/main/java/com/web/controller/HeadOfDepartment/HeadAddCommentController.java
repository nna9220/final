package com.web.controller.HeadOfDepartment;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.controller.Student.StudentAddCommentController;
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
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api/head/comment")
public class HeadAddCommentController {
    private static final Logger logger = LoggerFactory.getLogger(StudentAddCommentController.class);
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private FileMaterialService fileMaterialService;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private MailServiceImpl mailService;

    private final TokenUtils tokenUtils;
    @Autowired
    public HeadAddCommentController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }


    @Autowired
    private FileRepository fileRepository;
    @PostMapping("/create/{taskId}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<?> createComment(@PathVariable int taskId,
                                           @RequestParam("content") String content,
                                           @RequestParam(value = "fileInput", required = false) List<MultipartFile> files,
                                           @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Comment newComment = new Comment();
            newComment.setContent(content);
            newComment.setPoster(personCurrent);
            Task existTask = taskRepository.findById(taskId).orElse(null);
            Subject existSubject = subjectRepository.findById(existTask.getSubjectId().getSubjectId()).orElse(null);
            newComment.setTaskId(existTask);
            LocalDateTime nowDate = LocalDateTime.now();
            newComment.setDateSubmit(nowDate);
            var comment = commentRepository.save(newComment);
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String fileName = fileMaterialService.storeFile(file);
                        FileComment newFile = new FileComment();
                        newFile.setName(fileName);
                        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                                .scheme("https")
                                .path("/api/head/comment/fileUpload/")
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
            String subject = "Update comment " + existTask.getRequirement() ;
            String messenger = "Topic: " + existSubject.getSubjectName()+"\n" +
                    "Change by: " + personCurrent.getUsername() + "\n"
                    + "Change task: " + existTask.getRequirement()+"\n"
                    + "Content: " + comment.getContent();
            newMail.setSubject(subject);
            newMail.setSubject(messenger);
            List<String> emailPerson = new ArrayList<>();
            if (existSubject.getStudent1()!=null) {
                Student student1 = studentRepository.findById(existSubject.getStudent1()).orElse(null);
                if (student1.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                    emailPerson.add(student1.getPerson().getUsername());
                }
            }
            if (existSubject.getStudent2()!=null) {
                Student student2 = studentRepository.findById(existSubject.getStudent2()).orElse(null);
                if (student2.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                    emailPerson.add(student2.getPerson().getUsername());
                }
            }
            if (existSubject.getStudent3()!=null) {
                Student student3 = studentRepository.findById(existSubject.getStudent3()).orElse(null);
                if (student3.getPerson().getPersonId()!=personCurrent.getPersonId()) {
                    emailPerson.add(student3.getPerson().getUsername());
                }
            }
            return new ResponseEntity<>(comment, HttpStatus.CREATED);
        }else{
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/fileUpload/{fileName}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<Resource> viewFile(@PathVariable String fileName, HttpServletRequest request) {
        Resource resource = fileMaterialService.loadFileAsResource(fileName);
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Could not determine file type.");
        }

        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
    @GetMapping("/download/{fileName}")
    @PreAuthorize("hasAuthority('ROLE_HEAD')")
    public ResponseEntity<Resource> redirectToDownload(@PathVariable String fileName) {
        String redirectUrl = "/fileUpload/" + fileName;
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, redirectUrl)
                .build();
    }
}
