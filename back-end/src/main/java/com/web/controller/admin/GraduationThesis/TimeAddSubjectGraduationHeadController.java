package com.web.controller.admin.GraduationThesis;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.Person;
import com.web.entity.TimeAddSubjectOfHead;
import com.web.entity.TypeSubject;
import com.web.repository.PersonRepository;
import com.web.repository.TimeAddSubjectHeadRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.utils.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/graduation/timeAddSubject")
public class TimeAddSubjectGraduationHeadController {
    @Autowired
    private TimeAddSubjectHeadRepository timeAddSubjectHeadRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    private final TokenUtils tokenUtils;
    @Autowired
    public TimeAddSubjectGraduationHeadController(TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }

    @GetMapping
    public ResponseEntity<Map<String,Object>> findAllExisted(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận chuyên ngành");
            List<TimeAddSubjectOfHead> timeAddSubjectOfHeads = timeAddSubjectHeadRepository.findAllPeriodEssay(typeSubject);
            //List<TimeBrowsOfHead> timeBrowsOfHeads = timeBrowseHeadRepository.findAll();
            List<TypeSubject> typeSubjects = typeSubjectRepository.findAll();
            Map<String,Object> response = new HashMap<>();
            response.put("timeBrowse",timeAddSubjectOfHeads);
            response.put("person",personCurrent);
            response.put("listTypeSubject", typeSubjects);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> savePeriod(@RequestHeader("Authorization") String authorizationHeader,
                                   @RequestParam("timeStart") String timeStart,
                                   @RequestParam("timeEnd") String timeEnd, HttpServletRequest request){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            TimeAddSubjectOfHead timeAddSubjectOfHead = new TimeAddSubjectOfHead();
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận chuyên ngành");
            timeAddSubjectOfHead.setTypeSubjectId(typeSubject);
            timeAddSubjectOfHead.setTimeStart(convertToSqlDate(timeStart));
            timeAddSubjectOfHead.setTimeEnd(convertToSqlDate(timeEnd));
            timeAddSubjectHeadRepository.save(timeAddSubjectOfHead);
            return new ResponseEntity<>(timeAddSubjectOfHead,HttpStatus.CREATED);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

    }

    @GetMapping("/{timeId}")
    public ResponseEntity<Map<String,Object>> editTime(@PathVariable int timeId, @RequestHeader("Authorization") String authorizationHeader) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            TimeAddSubjectOfHead timeAddSubjectOfHead = timeAddSubjectHeadRepository.findById(timeId).orElse(null);
            List<TypeSubject> typeSubjects = typeSubjectRepository.findAll();
            if (timeAddSubjectOfHead != null) {
                Map<String,Object> response = new HashMap<>();
                response.put("time",timeAddSubjectOfHead);
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

    private Date convertToSqlDate(String dateString) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            java.util.Date parsedDate = dateFormat.parse(dateString);
            return new Date(parsedDate.getTime());
        } catch (ParseException e) {
            // Xử lý ngoại lệ khi có lỗi trong quá trình chuyển đổi
            e.printStackTrace();
            return null; // hoặc throw một Exception phù hợp
        }
    }
    @PostMapping("/edit/{periodId}")
    public ResponseEntity<?> updateTime(@PathVariable int periodId,
                                          @RequestParam("start") String start,
                                          @RequestParam("end") String end,
                                          @RequestHeader("Authorization") String authorizationHeader,
                                          @ModelAttribute("successMessage") String successMessage) throws ParseException {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            TimeAddSubjectOfHead existTimeAdd = timeAddSubjectHeadRepository.findById(periodId).orElse(null);
            if (existTimeAdd != null) {
                if (convertToSqlDate(end).before(convertToSqlDate(start))) {
                    return new ResponseEntity<>("Ngày kết thúc phải lớn hơn ngày bắt đầu", HttpStatus.BAD_REQUEST);
                }
                System.out.println("data nhận về:" + start + " end : " + end);
                existTimeAdd.setTimeStart(convertToSqlDate(start));
                existTimeAdd.setTimeEnd(convertToSqlDate(end));
                timeAddSubjectHeadRepository.save(existTimeAdd);
                return new ResponseEntity<>(existTimeAdd,HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
