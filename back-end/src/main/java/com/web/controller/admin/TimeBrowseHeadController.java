package com.web.controller.admin;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.mapper.RegistrationPeriodMapper;
import com.web.repository.*;
import com.web.service.Admin.RegistrationPeriodService;
import com.web.service.MailServiceImpl;
import com.web.utils.Contains;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/timeBrowse")
public class TimeBrowseHeadController {
    @Autowired
    private TimeBrowseHeadRepository timeBrowseHeadRepository;
    @Autowired
    private AuthorityRepository authorityRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private NotificationRepository notificationRepository;
    private final TokenUtils tokenUtils;
    @Autowired
    public TimeBrowseHeadController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String,Object>> findAllExisted(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            List<TimeBrowsOfHead> timeBrowsOfHeads = timeBrowseHeadRepository.findAllPeriodEssay(typeSubject);
            //List<TimeBrowsOfHead> timeBrowsOfHeads = timeBrowseHeadRepository.findAll();
            List<TypeSubject> typeSubjects = typeSubjectRepository.findAll();
            Map<String,Object> response = new HashMap<>();
            response.put("timeBrowse",timeBrowsOfHeads);
            response.put("person",personCurrent);
            response.put("listTypeSubject", typeSubjects);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> savePeriod(@RequestHeader("Authorization") String authorizationHeader,
                                   @RequestParam("timeStart") String timeStart,
                                   @RequestParam("timeEnd") String timeEnd, HttpServletRequest request){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            TimeBrowsOfHead timeBrowsOfHead = new TimeBrowsOfHead();
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            timeBrowsOfHead.setTypeSubjectId(typeSubject);
            timeBrowsOfHead.setTimeStart(convertToLocalDateTime(timeStart));
            timeBrowsOfHead.setTimeEnd(convertToLocalDateTime(timeEnd));
            timeBrowsOfHead.setStatus(true);
            timeBrowseHeadRepository.save(timeBrowsOfHead);
            return new ResponseEntity<>(timeBrowsOfHead,HttpStatus.CREATED);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

    }

    @GetMapping("/{timeId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String,Object>> editTime(@PathVariable int timeId, @RequestHeader("Authorization") String authorizationHeader) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            TimeBrowsOfHead timeBrowsOfHead = timeBrowseHeadRepository.findById(timeId).orElse(null);
            List<TypeSubject> typeSubjects = typeSubjectRepository.findAll();
            if (timeBrowsOfHead != null) {
                Map<String,Object> response = new HashMap<>();
                response.put("time",timeBrowsOfHead);
                response.put("person",personCurrent);
                response.put("listTypeSubject", typeSubjects);
                return new ResponseEntity<>(response,HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    private static LocalDateTime convertToLocalDateTime(String dateString) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            return LocalDateTime.parse(dateString, formatter);
        } catch (DateTimeParseException e) {
            // Xử lý ngoại lệ khi có lỗi trong quá trình chuyển đổi
            System.out.println("Lỗi: " + e);
            e.printStackTrace();
            return null; // hoặc throw một Exception phù hợp
        }
    }

    @PostMapping("/edit/{periodId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateTime(@PathVariable int periodId,
                                          @RequestParam("start") String start,
                                          @RequestParam("end") String end,
                                          @RequestHeader("Authorization") String authorizationHeader,
                                          @ModelAttribute("successMessage") String successMessage) throws ParseException {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            TimeBrowsOfHead existTimeBrowsOfHead = timeBrowseHeadRepository.findById(periodId).orElse(null);
            if (existTimeBrowsOfHead != null) {
                if (convertToLocalDateTime(end).isBefore(convertToLocalDateTime(start))) {
                    return new ResponseEntity<>("Ngày kết thúc phải lớn hơn ngày bắt đầu", HttpStatus.BAD_REQUEST);
                }
                System.out.println("data nhận về:" + start + " end : " + end);
                existTimeBrowsOfHead.setTimeStart(convertToLocalDateTime(start));
                existTimeBrowsOfHead.setTimeEnd(convertToLocalDateTime(end));
                existTimeBrowsOfHead.setStatus(true);
                var update = timeBrowseHeadRepository.save(existTimeBrowsOfHead);
                //GỬI MAIL
                //TBM
                Authority authority = authorityRepository.findByName("ROLE_HEAD");
                List<Lecturer> lecturers = lecturerRepository.getListLecturerISHead(authority);
                List<String> emailLecturer = new ArrayList<>();
                for (Lecturer lecturer:lecturers) {
                    emailLecturer.add(lecturer.getPerson().getUsername());
                }
                MailStructure newMail = new MailStructure();
                String subject = "THÔNG BÁO THỜI GIAN DUYỆT ĐỀ TÀI TIỂU LUẬN CHUYÊN NGÀNH CHO TBM";
                String messenger = "Thời gian bắt đầu: " + update.getTimeStart()+"\n" +
                        "Thời gian kết thúc: " + update.getTimeEnd() + "\n";
                newMail.setSubject(subject);
                newMail.setSubject(messenger);
                if (!lecturers.isEmpty()){
                    mailService.sendMailToStudents(emailLecturer,subject,messenger);
                }

                String title = "THÔNG BÁO THỜI GIAN DUYỆT ĐỀ TÀI TIỂU LUẬN CHUYÊN NGÀNH CHO TBM";
                String content = "Thời gian bắt đầu: " + update.getTimeStart()+"\n" +
                        "Thời gian kết thúc: " + update.getTimeEnd() + "\n";
                List<Person> personList = new ArrayList<>();
                for (String s:emailLecturer) {
                    Person p = personRepository.findUsername(s);
                    if (p!=null){
                        personList.add(p);
                    }
                }
                Notification notification = new Notification();
                notification.setContent(content);
                notification.setTitle(title);
                notification.setPersons(personList);
                LocalDateTime now = LocalDateTime.now();
                notification.setDateSubmit(now);
                notificationRepository.save(notification);
                return new ResponseEntity<>(existTimeBrowsOfHead,HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
