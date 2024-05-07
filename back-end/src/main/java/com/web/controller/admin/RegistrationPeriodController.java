package com.web.controller.admin;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;
import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.mapper.RegistrationPeriodMapper;
import com.web.dto.request.RegistrationPeriodRequest;
import com.web.repository.PersonRepository;
import com.web.repository.RegistrationPeriodRepository;
import com.web.repository.StudentRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Admin.RegistrationPeriodService;
import com.web.service.MailServiceImpl;
import com.web.utils.Contains;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/Period")
public class RegistrationPeriodController {
    @Autowired
    private StudentRepository studentRepository;
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
    public RegistrationPeriodController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }


    @GetMapping
    public ResponseEntity<Map<String,Object>> findAllExisted(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {

            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
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
    public ResponseEntity<?> savePeriod(@RequestHeader("Authorization") String authorizationHeader,
                                        @RequestParam("periodName") String periodName,
                                   @RequestParam("timeStart") Date timeStart,
                                   @RequestParam("timeEnd") Date timeEnd, HttpServletRequest request){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            RegistrationPeriod registrationPeriod = new RegistrationPeriod();
            registrationPeriod.setRegistrationName(periodName);
            registrationPeriod.setRegistrationTimeStart(timeStart);
            registrationPeriod.setRegistrationTimeEnd(timeEnd);
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");
            registrationPeriod.setTypeSubjectId(typeSubject);
            registrationPeriodRepository.save(registrationPeriod);
            return new ResponseEntity<>(registrationPeriod,HttpStatus.CREATED);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

    }

    @GetMapping("/{periodId}")
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
                                          @RequestHeader("Authorization") String authorizationHeader,
                                          @ModelAttribute("successMessage") String successMessage) throws ParseException {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            RegistrationPeriod existRegistrationPeriod = registrationPeriodRepository.findById(periodId).orElse(null);
            if (existRegistrationPeriod != null) {
                if (convertToSqlDate(end).before(convertToSqlDate(start))) {
                    return new ResponseEntity<>("Ngày kết thúc phải lớn hơn ngày bắt đầu", HttpStatus.BAD_REQUEST);
                }
                System.out.println("data nhận về:" + start + " end : " + end);
                existRegistrationPeriod.setRegistrationTimeStart(convertToSqlDate(start));
                existRegistrationPeriod.setRegistrationTimeEnd(convertToSqlDate(end));
                var update = registrationPeriodRepository.save(existRegistrationPeriod);
                //GỬI MAIL
                //Dnah sách SV
                List<Student> studentList = studentRepository.findAll();
                List<String> emailLecturer = new ArrayList<>();
                for (Student student:studentList) {
                    emailLecturer.add(student.getPerson().getUsername());
                }
                MailStructure newMail = new MailStructure();
                String subject = "THÔNG BÁO THỜI GIAN ĐĂNG KÝ ĐỀ TÀI TIỂU LUẬN CHUYÊN NGÀNH CHO SINH VIÊN " + update.getRegistrationName();
                String messenger = "Thời gian bắt đầu: " + update.getRegistrationTimeStart()+"\n" +
                        "Thời gian kết thúc: " + update.getRegistrationTimeEnd() + "\n";
                newMail.setSubject(subject);
                newMail.setSubject(messenger);
                if (!studentList.isEmpty()){
                    mailService.sendMailToStudents(emailLecturer,subject,messenger);
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
