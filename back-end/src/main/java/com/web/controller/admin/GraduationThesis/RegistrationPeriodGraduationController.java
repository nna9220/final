package com.web.controller.admin.GraduationThesis;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;
import com.web.config.CheckRole;
import com.web.config.CompareTime;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.mapper.RegistrationPeriodMapper;
import com.web.dto.request.RegistrationPeriodRequest;
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
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
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
@RequestMapping("/api/admin/PeriodGraduation")
public class RegistrationPeriodGraduationController {
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private TimeBrowseHeadRepository timeBrowseHeadRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private RegistrationPeriodRepository registrationPeriodRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;

    private final TokenUtils tokenUtils;
    @Autowired
    public RegistrationPeriodGraduationController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }


    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String,Object>> findAllExisted(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            List<RegistrationPeriod> registrationPeriods = registrationPeriodRepository.findAllByTypeSubject(typeSubject);

            Map<String,Object> response = new HashMap<>();
            response.put("period",registrationPeriods);
            response.put("person",personCurrent);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> savePeriod(@RequestHeader("Authorization") String authorizationHeader,
                                        @RequestParam("periodName") String periodName,
                                        @RequestParam("timeStart") String timeStart,
                                        @RequestParam("timeEnd") String timeEnd, HttpServletRequest request){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            RegistrationPeriod registrationPeriod = new RegistrationPeriod();
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            if (convertToLocalDateTime(timeEnd).isBefore(convertToLocalDateTime(timeStart))) {
                //Mã lỗi 400
                return new ResponseEntity<>("Ngày kết thúc phải lớn hơn ngày bắt đầu", HttpStatus.BAD_REQUEST);
            }
            List<TimeBrowsOfHead> timeBrowsOfHeads = timeBrowseHeadRepository.getListTimeBrowseByStatus(typeSubject);
            //kiểm tra xem nó có nằm sau thời gian duyệt ề tài của TBM không.
            if (!CompareTime.isStartAfter(timeBrowsOfHeads,convertToLocalDateTime(timeStart))){
                //mã lỗi 406
                return new ResponseEntity<>("Thời gian đăng ký của SV phải ở sau thời gian duyệt đề tài của TBM",HttpStatus.NOT_ACCEPTABLE);
            }
            registrationPeriod.setRegistrationName(periodName);
            registrationPeriod.setRegistrationTimeStart(convertToLocalDateTime(timeStart));
            registrationPeriod.setRegistrationTimeEnd(convertToLocalDateTime(timeEnd));
            registrationPeriod.setTypeSubjectId(typeSubject);
            var save = registrationPeriodRepository.save(registrationPeriod);
            List<Student> studentList = studentRepository.getListStudentActiveTrue();
            List<String> emailLecturer = new ArrayList<>();
            String subject = "THÔNG BÁO THỜI GIAN ĐĂNG KÝ ĐỀ TÀI KLTN CHO SINH VIÊN " + save.getRegistrationName();
            String messenger = "Thời gian bắt đầu: " + save.getRegistrationTimeStart()+"\n" +
                    "Thời gian kết thúc: " + save.getRegistrationTimeEnd() + "\n";
            if (!studentList.isEmpty()){
                mailService.sendMailToStudents(emailLecturer,subject,messenger);
            }
            //Tạo thông báo trên web
            String title = "THÔNG BÁO THỜI GIAN ĐĂNG KÝ ĐỀ TÀI KLTN CHO SINH VIÊN";
            String content = "Thời gian bắt đầu: " + save.getRegistrationTimeStart()+"\n" +
                    "Thời gian kết thúc: " + save.getRegistrationTimeEnd() + "\n";
            Notification notification = new Notification();
            notification.setContent(content);
            notification.setTitle(title);
            LocalDateTime now = LocalDateTime.now();
            notification.setDateSubmit(now);
            notificationRepository.save(notification);
            return new ResponseEntity<>(registrationPeriod,HttpStatus.CREATED);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

    }

    @GetMapping("/{periodId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String,Object>> editClass(@PathVariable int periodId, @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            // Lấy thông tin lớp học cần chỉnh sửa từ service
            RegistrationPeriod registrationPeriod = registrationPeriodRepository.findById(periodId).orElse(null);
            List<TypeSubject> typeSubjects = typeSubjectRepository.findAll();
            // Kiểm tra xem lớp học có tồn tại không
            if (registrationPeriod != null) {
                Map<String,Object> response = new HashMap<>();
                response.put("listTypeSubject",typeSubjects);
                response.put("period",registrationPeriod);
                response.put("person",personCurrent);
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
    public ResponseEntity<?> updatePeriod(@PathVariable int periodId,
                                          @RequestParam("start") String start,
                                          @RequestParam("end") String end,
                                          @RequestHeader("Authorization") String authorizationHeader,
                                          @RequestParam(value = "status", required = false) boolean status,
                                          @ModelAttribute("successMessage") String successMessage) throws ParseException {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            RegistrationPeriod existRegistrationPeriod = registrationPeriodRepository.findById(periodId).orElse(null);
            if (existRegistrationPeriod != null) {
                if (convertToLocalDateTime(end).isBefore(convertToLocalDateTime(start))) {
                    return new ResponseEntity<>("Ngày kết thúc phải lớn hơn ngày bắt đầu", HttpStatus.BAD_REQUEST);
                }
                System.out.println("data nhận về:" + start + " end : " + end);
                List<TimeBrowsOfHead> timeBrowsOfHeads = timeBrowseHeadRepository.getListTimeBrowseByStatus(existRegistrationPeriod.getTypeSubjectId());
                //kiểm tra xem nó có nằm sau thời gian duyệt ề tài của TBM không.
                if (!CompareTime.isStartAfter(timeBrowsOfHeads,convertToLocalDateTime(start))){
                    //mã lỗi 406
                    return new ResponseEntity<>("Thời gian đăng ký của SV phải ở sau thời gian duyệt đề tài của TBM",HttpStatus.NOT_ACCEPTABLE);
                }
                existRegistrationPeriod.setRegistrationTimeStart(convertToLocalDateTime(start));
                existRegistrationPeriod.setRegistrationTimeEnd(convertToLocalDateTime(end));
                existRegistrationPeriod.setStatus(status);
                var update = registrationPeriodRepository.save(existRegistrationPeriod);
                //GỬI MAIL
                //Dnah sách SV
                List<Student> studentList = studentRepository.getListStudentActiveTrue();
                List<String> emailLecturer = new ArrayList<>();
                for (Student student:studentList) {
                    emailLecturer.add(student.getPerson().getUsername());
                }
                MailStructure newMail = new MailStructure();
                String subject = "THÔNG BÁO CẬP NHẬT THỜI GIAN ĐĂNG KÝ ĐỀ TÀI KLTN CHO SINH VIÊN " + update.getRegistrationName();
                String messenger = "Thời gian bắt đầu: " + update.getRegistrationTimeStart()+"\n" +
                        "Thời gian kết thúc: " + update.getRegistrationTimeEnd() + "\n";
                newMail.setSubject(subject);
                newMail.setSubject(messenger);
                if (!studentList.isEmpty()){
                    mailService.sendMailToStudents(emailLecturer,subject,messenger);
                }
                //Tạo thông báo trên web
                String title = "THÔNG BÁO CẬP NHẬT THỜI GIAN ĐĂNG KÝ ĐỀ TÀI KLTN CHO SINH VIÊN";
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
