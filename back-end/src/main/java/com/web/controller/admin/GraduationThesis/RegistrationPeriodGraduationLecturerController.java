package com.web.controller.admin.GraduationThesis;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.dto.request.RegistrationPeriodLecturerRequest;
import com.web.entity.*;
import com.web.mapper.RegistrationPeriodMapper;
import com.web.repository.LecturerRepository;
import com.web.repository.PersonRepository;
import com.web.repository.RegistrationPeriodLecturerRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Admin.RegistrationPeriodService;
import com.web.service.MailServiceImpl;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/PeriodGraduationLecturer")
public class RegistrationPeriodGraduationLecturerController {
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private RegistrationPeriodLecturerRepository registrationPeriodRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    private final TokenUtils tokenUtils;
    @Autowired
    public RegistrationPeriodGraduationLecturerController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }

    @GetMapping
    public ResponseEntity<Map<String,Object>> findAllExisted(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            List<RegistrationPeriodLectuer> registrationPeriods = registrationPeriodRepository.findAllPeriodEssay(typeSubject);
            Map<String,Object> response = new HashMap<>();
            response.put("period",registrationPeriods);
            response.put("person",personCurrent);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> savePeriod(@RequestHeader("Authorization") String authorizationHeader, @RequestParam("periodName") String periodName,
                                        @RequestParam("timeStart") Date timeStart,
                                        @RequestParam("timeEnd") Date timeEnd, HttpServletRequest request){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            RegistrationPeriodLectuer registrationPeriod = new RegistrationPeriodLectuer();
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            registrationPeriod.setTypeSubjectId(typeSubject);
            registrationPeriod.setRegistrationName(periodName);
            registrationPeriod.setRegistrationTimeStart(timeStart);
            registrationPeriod.setRegistrationTimeEnd(timeEnd);
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

    private java.sql.Date convertToSqlDate(String dateString) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            java.util.Date parsedDate = dateFormat.parse(dateString);
            return new java.sql.Date(parsedDate.getTime());
        } catch (ParseException e) {
            // Xử lý ngoại lệ khi có lỗi trong quá trình chuyển đổi
            e.printStackTrace();
            return null; // hoặc throw một Exception phù hợp
        }
    }
    @PostMapping("/edit/{periodId}")
    public ResponseEntity<?> updatePeriod(@PathVariable int periodId,
                                          @RequestParam("start") String start,
                                          @RequestParam("end") String end,
                                          @RequestParam("typeSubject") TypeSubject typeSubject,
                                          @RequestHeader("Authorization") String authorizationHeader,
                                          @ModelAttribute("successMessage") String successMessage) throws ParseException {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            RegistrationPeriodLectuer existRegistrationPeriod = registrationPeriodRepository.findById(periodId).orElse(null);
            if (existRegistrationPeriod != null) {
                System.out.println("data nhận về:" + start + " end : " + end);
                if (convertToSqlDate(end).before(convertToSqlDate(start))) {
                    return new ResponseEntity<>("Ngày kết thúc phải lớn hơn ngày bắt đầu", HttpStatus.BAD_REQUEST);
                }
                existRegistrationPeriod.setTypeSubjectId(typeSubject);
                existRegistrationPeriod.setRegistrationTimeStart(convertToSqlDate(start));
                existRegistrationPeriod.setRegistrationTimeEnd(convertToSqlDate(end));
                var update = registrationPeriodRepository.save(existRegistrationPeriod);
                //GỬI MAIL
                //Dnah sách giảng viên
                List<Lecturer> lecturers = lecturerRepository.findAll();
                List<String> emailLecturer = new ArrayList<>();
                for (Lecturer lecturer:lecturers) {
                    emailLecturer.add(lecturer.getPerson().getUsername());
                }
                MailStructure newMail = new MailStructure();
                String subject = "THÔNG BÁO THỜI GIAN ĐĂNG KÝ ĐỀ TÀI KHÓA LUẬN TỐT NGHIỆP CHO GIẢNG VIÊN " + update.getRegistrationName();
                String messenger = "Thời gian bắt đầu: " + update.getRegistrationTimeStart()+"\n" +
                        "Thời gian kết thúc: " + update.getRegistrationTimeEnd() + "\n";
                newMail.setSubject(subject);
                newMail.setSubject(messenger);
                if (!lecturers.isEmpty()){
                    mailService.sendMailToLecturers(emailLecturer,subject,messenger);
                }
                return new ResponseEntity<>(existRegistrationPeriod,HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
