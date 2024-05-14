package com.web.service.Student;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.FileComment;
import com.web.entity.Person;
import com.web.entity.Student;
import com.web.entity.Subject;
import com.web.repository.LecturerRepository;
import com.web.repository.PersonRepository;
import com.web.repository.StudentRepository;
import com.web.repository.SubjectRepository;
import com.web.service.FileMaterialService;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ManageSubjectService {
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private FileMaterialService fileMaterialService;

    public ResponseEntity<?> SubmitReportFifty(int id,@RequestHeader("Authorization") String authorizationHeader,@RequestParam(value = "fileInput", required = true) MultipartFile files){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            Student existedStudent = studentRepository.findById(personCurrent.getPersonId()).orElse(null);
            if (existedSubject!=null){
                existedSubject.setActive((byte)5);
                //nộp file
                if (!files.isEmpty()) {
                    String fileName = fileMaterialService.storeFile(files);
                    FileComment newFile = new FileComment();
                    newFile.setName(fileName);
                    String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                            .scheme("https")
                            .path("/api/student/manage/fileUpload/")
                            .path(fileName)
                            .toUriString();
                    newFile.setUrl(fileDownloadUri);
                    var fileSave = fileMaterialService.uploadFile(newFile);
                    existedSubject.setFiftyPercent(fileSave);
                }else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
                subjectRepository.save(existedSubject);
                return new ResponseEntity<>(existedStudent,HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    public ResponseEntity<?> SubmitReportOneHundred(int id,@RequestHeader("Authorization") String authorizationHeader,MultipartFile files){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            Student existedStudent = studentRepository.findById(personCurrent.getPersonId()).orElse(null);
            if (existedSubject!=null){
                existedSubject.setActive((byte)5);
                //nộp file
                if (!files.isEmpty()) {
                    String fileName = fileMaterialService.storeFile(files);
                    FileComment newFile = new FileComment();
                    newFile.setName(fileName);
                    String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                            .scheme("https")
                            .path("/api/student/manage/fileUpload/")
                            .path(fileName)
                            .toUriString();
                    newFile.setUrl(fileDownloadUri);
                    var fileSave = fileMaterialService.uploadFile(newFile);
                    existedSubject.setOneHundredPercent(fileSave);
                }else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
                subjectRepository.save(existedSubject);
                return new ResponseEntity<>(existedStudent,HttpStatus.OK);
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
