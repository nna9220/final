package com.web.controller.admin.GraduationThesis;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.dto.request.RegistrationPeriodLecturerRequest;
import com.web.entity.Person;
import com.web.entity.RegistrationPeriodLectuer;
import com.web.entity.TypeSubject;
import com.web.mapper.RegistrationPeriodMapper;
import com.web.repository.PersonRepository;
import com.web.repository.RegistrationPeriodLecturerRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Admin.RegistrationPeriodService;
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
@RequestMapping("/api/admin/PeriodGraduationLecturer")
public class RegistrationPeriodGraduationLecturerController {
    @Autowired
    private RegistrationPeriodService registrationPeriodService;
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
            response.put("listTypeSubject",typeSubject);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
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
            registrationPeriod.setRegistrationName(periodName);
            registrationPeriod.setRegistrationTimeStart(timeStart);
            registrationPeriod.setRegistrationTimeEnd(timeEnd);
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            registrationPeriod.setTypeSubjectId(typeSubject);
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

    @PostMapping("/edit/{periodId}")
    public ResponseEntity<?> updatePeriod(@PathVariable int periodId, @RequestBody RegistrationPeriodLecturerRequest registrationPeriodLectuer, @RequestHeader("Authorization") String authorizationHeader,
                                          @ModelAttribute("successMessage") String successMessage) throws ParseException {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            RegistrationPeriodLectuer existRegistrationPeriod = registrationPeriodRepository.findById(periodId).orElse(null);
            if (existRegistrationPeriod != null) {
                System.out.println("Data nhận được: " +  registrationPeriodLectuer.getPeriodId());
                SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                java.util.Date utilStartDate = dateFormat.parse(registrationPeriodLectuer.getRegistrationTimeStart());
                Date startFormat = new Date(utilStartDate.getTime());
                java.util.Date utilEndDate = dateFormat.parse(registrationPeriodLectuer.getRegistrationTimeEnd());
                Date endFormat = new Date(utilEndDate.getTime());
                existRegistrationPeriod.setTypeSubjectId(registrationPeriodLectuer.getTypeSubjectId());
                existRegistrationPeriod.setRegistrationTimeStart(startFormat);
                existRegistrationPeriod.setRegistrationTimeEnd(endFormat);
                registrationPeriodRepository.save(existRegistrationPeriod);
                return new ResponseEntity<>(existRegistrationPeriod,HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}
