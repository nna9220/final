package com.web.controller.admin;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.mapper.RegistrationPeriodMapper;
import com.web.repository.*;
import com.web.service.Admin.RegistrationPeriodService;
import com.web.service.MailServiceImpl;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.sql.Date;
import java.sql.Timestamp;
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
@RequestMapping("/api/admin/PeriodLecturer")
public class RegistrationPeriodLecturerController {
    @Autowired
    private RegistrationPeriodService registrationPeriodService;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private RegistrationPeriodMapper registrationPeriodMapper;
    @Autowired
    private RegistrationPeriodLecturerRepository registrationPeriodRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    private final TokenUtils tokenUtils;

    @Autowired
    public RegistrationPeriodLecturerController (TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }

    @GetMapping
    public ResponseEntity<Map<String,Object>> findAllExisted(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            List<RegistrationPeriodLectuer> registrationPeriods = registrationPeriodRepository.findAllPeriodEssay(typeSubject);
            List<TypeSubject> typeSubjects = typeSubjectRepository.findAll();
            Map<String,Object> response = new HashMap<>();
            response.put("period",registrationPeriods);
            response.put("person",personCurrent);
            response.put("listTypeSubject", typeSubjects);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> savePeriod(@RequestHeader("Authorization") String authorizationHeader,
                                        @RequestParam("periodName") String periodName,
                                   @RequestParam("timeStart") String timeStart,
                                   @RequestParam("timeEnd") String timeEnd, HttpServletRequest request){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            RegistrationPeriodLectuer registrationPeriod = new RegistrationPeriodLectuer();
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            registrationPeriod.setTypeSubjectId(typeSubject);
            registrationPeriod.setRegistrationName(periodName);
            registrationPeriod.setRegistrationTimeStart(convertToLocalDateTime(timeStart));
            registrationPeriod.setRegistrationTimeEnd(convertToLocalDateTime(timeEnd));
            registrationPeriodRepository.save(registrationPeriod);
            return new ResponseEntity<>(registrationPeriod,HttpStatus.CREATED);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

    }

    @GetMapping("/{periodId}")
    public ResponseEntity<Map<String,Object>> editClass(@PathVariable int periodId, @RequestHeader("Authorization") String authorizationHeader) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            // Lấy thông tin lớp học cần chỉnh sửa từ service
            RegistrationPeriodLectuer registrationPeriod = registrationPeriodRepository.findById(periodId).orElse(null);
            List<TypeSubject> typeSubjects = typeSubjectRepository.findAll();
            if (registrationPeriod != null) {
                Map<String,Object> response = new HashMap<>();
                response.put("period",registrationPeriod);
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
    public ResponseEntity<?> updatePeriod(@PathVariable int periodId,
                                          @RequestParam("start") String start,
                                          @RequestParam("end") String end,
                                          @RequestHeader("Authorization") String authorizationHeader,
                                          @ModelAttribute("successMessage") String successMessage) throws ParseException {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            RegistrationPeriodLectuer existRegistrationPeriod = registrationPeriodRepository.findById(periodId).orElse(null);
            if (existRegistrationPeriod != null) {
                if (convertToLocalDateTime(end).isBefore(convertToLocalDateTime(start))) {
                    return new ResponseEntity<>("Ngày kết thúc phải lớn hơn ngày bắt đầu", HttpStatus.BAD_REQUEST);
                }
                System.out.println("data nhận về:" + start + " end : " + end);
                existRegistrationPeriod.setRegistrationTimeStart(convertToLocalDateTime(start));
                existRegistrationPeriod.setRegistrationTimeEnd(convertToLocalDateTime(end));
                var update = registrationPeriodRepository.save(existRegistrationPeriod);
                //GỬI MAIL
                //Dnah sách giảng viên
                List<Lecturer> lecturers = lecturerRepository.findAll();
                List<String> emailLecturer = new ArrayList<>();
                for (Lecturer lecturer:lecturers) {
                    emailLecturer.add(lecturer.getPerson().getUsername());
                }
                MailStructure newMail = new MailStructure();
                String subject = "THÔNG BÁO THỜI GIAN ĐĂNG KÝ ĐỀ TÀI TIỂU LUẬN CHUYÊN NGÀNH CHO GIẢNG VIÊN " + update.getRegistrationName();
                String messenger = "Thời gian bắt đầu: " + update.getRegistrationTimeStart()+"\n" +
                        "Thời gian kết thúc: " + update.getRegistrationTimeEnd() + "\n";
                newMail.setSubject(subject);
                newMail.setSubject(messenger);
                if (!lecturers.isEmpty()){
                    mailService.sendMailToLecturers(emailLecturer,subject,messenger);
                }
                String title = "THÔNG BÁO THỜI GIAN ĐĂNG KÝ ĐỀ TÀI TIỂU LUẬN CHUYÊN NGÀNH CHO GIẢNG VIÊN";
                String content = "Thời gian bắt đầu: " + update.getRegistrationTimeStart()+"\n" +
                        "Thời gian kết thúc: " + update.getRegistrationTimeEnd() + "\n";
                Notification notification = new Notification();
                notification.setContent(content);
                notification.setTitle(title);
                LocalDateTime now = LocalDateTime.now();
                notification.setDateSubmit(now);
                notificationRepository.save(notification);
                return new ResponseEntity<>(existRegistrationPeriod,HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
