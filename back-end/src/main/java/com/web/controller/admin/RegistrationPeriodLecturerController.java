package com.web.controller.admin;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.dto.request.RegistrationPeriodLecturerRequest;
import com.web.dto.request.RegistrationPeriodRequest;
import com.web.entity.Person;
import com.web.entity.RegistrationPeriod;
import com.web.entity.RegistrationPeriodLectuer;
import com.web.entity.TypeSubject;
import com.web.mapper.RegistrationPeriodMapper;
import com.web.repository.PersonRepository;
import com.web.repository.RegistrationPeriodLecturerRepository;
import com.web.repository.RegistrationPeriodRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Admin.RegistrationPeriodService;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/PeriodLecturer")
public class RegistrationPeriodLecturerController {
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
    public RegistrationPeriodLecturerController (TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }

    @GetMapping
    public ResponseEntity<Map<String,Object>> findAllExisted(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
           List<RegistrationPeriodLectuer> registrationPeriods = registrationPeriodRepository.findAllPeriod();
            /*ModelAndView modelAndView = new ModelAndView("QuanLyDotDKLecturer");*//*
            modelAndView.addObject("period",registrationPeriods);
            modelAndView.addObject("person", personCurrent);*/
            Map<String,Object> response = new HashMap<>();
            response.put("period",registrationPeriods);
            response.put("person",personCurrent);
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
            registrationPeriodRepository.save(registrationPeriod);
            /*String referer = request.getHeader("Referer");
            // Thực hiện redirect trở lại trang trước đó
            return new ModelAndView("redirect:" + referer);*/
            return new ResponseEntity<>(registrationPeriod,HttpStatus.CREATED);
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
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
            // Kiểm tra xem lớp học có tồn tại không
            if (registrationPeriod != null) {
                // Trả về ModelAndView với thông tin lớp học và đường dẫn của trang chỉnh sửa
                /*ModelAndView model = new ModelAndView("admin_editPeriodLecturer");
                model.addObject("period", registrationPeriod);
                model.addObject("person", personCurrent);*/
                Map<String,Object> response = new HashMap<>();
                response.put("period",registrationPeriod);
                response.put("person",personCurrent);
                return new ResponseEntity<>(response,HttpStatus.OK);
            } else {
                // Trả về ModelAndView với thông báo lỗi nếu không tìm thấy lớp học
                /*ModelAndView errorModel = new ModelAndView("error");
                errorModel.addObject("errorMessage", "Không tìm thấy lớp học");
                return errorModel;*/
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
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
                /*SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
                Date dateStart = dateFormat.parse(start);
                Date dateEnd = dateFormat.parse(end);*/
                System.out.println("Data nhận được: " +  registrationPeriodLectuer.getPeriodId());

                SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                java.util.Date utilStartDate = dateFormat.parse(registrationPeriodLectuer.getRegistrationTimeStart());
                Date startFormat = new Date(utilStartDate.getTime());

                java.util.Date utilEndDate = dateFormat.parse(registrationPeriodLectuer.getRegistrationTimeEnd());
                Date endFormat = new Date(utilEndDate.getTime());

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
