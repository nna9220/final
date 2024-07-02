package com.web.controller.Student;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.Person;
import com.web.entity.Student;
import com.web.entity.TypeSubject;
import com.web.repository.PersonRepository;
import com.web.repository.StudentRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.FileMaterialService;
import com.web.service.Student.ManageSubjectService;
import com.web.service.ViewAndDownloadFileService;
import com.web.utils.UserUtils;
import lombok.AllArgsConstructor;
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

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/student/manage")
public class StudentManageEssayController {
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ManageSubjectService manageSubjectService;
    @Autowired
    private FileMaterialService fileMaterialService;
    private static final Logger logger = LoggerFactory.getLogger(StudentAddCommentController.class);


    @PostMapping("/submit/fifty")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<?> SubmitReportFifty(@RequestHeader("Authorization") String authorizationHeader,
                                               @RequestParam(value = "fileInput", required = true) MultipartFile files){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            String token = tokenUtils.extractToken(authorizationHeader);
            Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
            Student student = studentRepository.findById(personCurrent.getPersonId()).orElse(null);
            return new ResponseEntity<>(manageSubjectService.SubmitReportFifty(student.getSubjectId().getSubjectId(),authorizationHeader,files,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            throw new ExceptionInInitializerError(e);
        }
    }

    @PostMapping("/submit/oneHundred")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<?> SubmitReportOneHundred(@RequestHeader("Authorization") String authorizationHeader,
                                               @RequestParam(value = "fileInput", required = true) MultipartFile files){
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");

            String token = tokenUtils.extractToken(authorizationHeader);
            Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
            Student student = studentRepository.findById(personCurrent.getPersonId()).orElse(null);
            return new ResponseEntity<>(manageSubjectService.SubmitReportOneHundred(student.getSubjectId().getSubjectId(),authorizationHeader,files,typeSubject), HttpStatus.OK);
        }catch (Exception e){
            throw new ExceptionInInitializerError(e);
        }
    }

    @GetMapping("/fileUpload/{fileName}")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
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
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<Resource> redirectToDownload(@PathVariable String fileName) {
        String redirectUrl = "/fileUpload/" + fileName;
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, redirectUrl)
                .build();
    }
}
