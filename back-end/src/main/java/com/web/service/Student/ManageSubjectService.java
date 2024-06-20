package com.web.service.Student;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.*;
import com.web.service.FileMaterialService;
import com.web.service.MailServiceImpl;
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
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ManageSubjectService {
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private FileRepository fileRepository;
    @Autowired
    private FileMaterialService fileMaterialService;
    @Autowired
    private NotificationRepository notificationRepository;

    public ResponseEntity<?> SubmitReportFifty(int id,@RequestHeader("Authorization") String authorizationHeader,@RequestParam(value = "fileInput", required = true) MultipartFile files){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_STUDENT")) {
            Subject existedSubject = subjectRepository.findById(id).orElse(null);
            Student existedStudent = studentRepository.findById(personCurrent.getPersonId()).orElse(null);
            if (existedSubject!=null){
                if (existedSubject.getActive()==2) {
                    if (existedSubject.getFiftyPercent() == null) {
                        existedSubject.setActive((byte) 3);
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
                            subjectRepository.save(existedSubject);
                        } else {
                            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                        }
                        subjectRepository.save(existedSubject);
                        Subject existSubject = subjectRepository.findById(id).orElse(null);
                        String subject = "Topic: " + existSubject.getSubjectName();
                        String messenger = "Topic: " + existSubject.getSubjectName() + " đã nộp báo cáo 50%!!";
                        mailService.sendMailStudent(existSubject.getInstructorId().getPerson().getUsername(), subject, messenger);
                        Notification notification = new Notification();
                        LocalDateTime now = LocalDateTime.now();
                        notification.setDateSubmit(now);
                        notification.setTitle(subject);
                        notification.setContent(messenger);
                        notificationRepository.save(notification);
                        return new ResponseEntity<>(existedStudent, HttpStatus.OK);
                    } else {
                        FileComment fileComment = existedSubject.getFiftyPercent();
                        //xóa file cũ:
                        existedSubject.setFiftyPercent(null);
                        fileRepository.delete(fileComment);
                        existedSubject.setActive((byte) 3);
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
                            subjectRepository.save(existedSubject);
                        } else {
                            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                        }
                        subjectRepository.save(existedSubject);
                        Subject existSubject = subjectRepository.findById(id).orElse(null);
                        String subject = "Topic: " + existSubject.getSubjectName();
                        String messenger = "Topic: " + existSubject.getSubjectName() + " đã nộp lại báo cáo 50%!!";
                        mailService.sendMailStudent(existSubject.getInstructorId().getPerson().getUsername(), subject, messenger);
                        Notification notification = new Notification();
                        LocalDateTime now = LocalDateTime.now();
                        notification.setDateSubmit(now);
                        notification.setTitle(subject);
                        notification.setContent(messenger);
                        notificationRepository.save(notification);
                        return new ResponseEntity<>(existedStudent, HttpStatus.OK);
                    }
                }else {
                    return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
                }
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
                if (existedSubject.getActive()==4) {
                    if (existedSubject.getOneHundredPercent() == null) {
                        existedSubject.setActive((byte) 5);
                        System.out.println("Sau khi ktra null");
                        //nộp file
                        if (!files.isEmpty()) {
                            System.out.println("Kiểm tra file k rỗng");
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
                        } else {
                            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                        }
                        subjectRepository.save(existedSubject);
                        Subject existSubject = subjectRepository.findById(id).orElse(null);
                        String subject = "Topic: " + existSubject.getSubjectName();
                        String messenger = "Topic: " + existSubject.getSubjectName() + " đã nộp báo cáo 100%!!";
                        mailService.sendMailStudent(existSubject.getInstructorId().getPerson().getUsername(), subject, messenger);
                        Notification notification = new Notification();
                        LocalDateTime now = LocalDateTime.now();
                        notification.setDateSubmit(now);
                        notification.setTitle(subject);
                        notification.setContent(messenger);
                        notificationRepository.save(notification);
                        return new ResponseEntity<>(existedStudent, HttpStatus.OK);
                    } else {
                        FileComment fileComment = existedSubject.getOneHundredPercent();
                        System.out.println("File cũ: " + fileComment.getName());
                        //xóa file cũ:
                        existedSubject.setOneHundredPercent(null);
                        fileRepository.delete(fileComment);
                        existedSubject.setActive((byte) 5);
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
                        } else {
                            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                        }
                        subjectRepository.save(existedSubject);
                        Subject existSubject = subjectRepository.findById(id).orElse(null);
                        String subject = "Topic: " + existSubject.getSubjectName();
                        String messenger = "Topic: " + existSubject.getSubjectName() + " đã nộp lại báo cáo 100%!!";
                        mailService.sendMailStudent(existSubject.getInstructorId().getPerson().getUsername(), subject, messenger);
                        Notification notification = new Notification();
                        LocalDateTime now = LocalDateTime.now();
                        notification.setDateSubmit(now);
                        notification.setTitle(subject);
                        notification.setContent(messenger);
                        notificationRepository.save(notification);
                        return new ResponseEntity<>(existedStudent, HttpStatus.OK);
                    }
                }else {
                    return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
                }
            }else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
