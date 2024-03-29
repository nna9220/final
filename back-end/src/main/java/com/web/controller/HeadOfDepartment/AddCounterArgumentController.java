package com.web.controller.HeadOfDepartment;

import com.web.config.CheckRole;
import com.web.config.CompareTime;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.*;
import com.web.service.Admin.SubjectService;
import com.web.service.MailServiceImpl;
import com.web.service.ReportService;
import com.web.service.SubjectImplService;
import com.web.utils.Contains;
import com.web.utils.ExcelUtils;
import com.web.utils.UserUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/head/subject")
@RequiredArgsConstructor
public class AddCounterArgumentController {
    @Autowired
    private SubjectImplService service;
    @Autowired
    private SubjectService subjectService;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private MailServiceImpl mailService;
    @Autowired
    private ReportService reportService;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private RegistrationPeriodLecturerRepository registrationPeriodLecturerRepository;

    private final TokenUtils tokenUtils;


    @GetMapping("/export")
    public void generateExcelReport(HttpServletResponse response, HttpSession session) throws Exception{

        response.setContentType("application/octet-stream");
        LocalDate nowDate = LocalDate.now();

        String headerKey = "Content-Disposition";
        String headerValue = "attachment;filename=subject_" +nowDate+ ".xls";

        response.setHeader(headerKey, headerValue);

        reportService.generateExcel(response, session);
        response.flushBuffer();
    }


    @GetMapping("/listLecturer/{subjectId}")
    public ResponseEntity<Map<String,Object>> getAddCounterArgument(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject currentSubject = subjectRepository.findById(subjectId).orElse(null);
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            /*ModelAndView model = new ModelAndView("ListLecturerAddCounterArgument");*/
            List<Lecturer> lecturerList = lecturerRepository.getListLecturerNotCurrent(existedLecturer.getLecturerId());
            /*model.addObject("listLecturer",lecturerList);
            model.addObject("person", personCurrent);
            model.addObject("subject",currentSubject);
            return model;*/
            Map<String,Object> response = new HashMap<>();
            response.put("listLecturer", lecturerList);
            response.put("person",personCurrent);
            response.put("subject", currentSubject);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/listAdd")
    public ResponseEntity<Map<String,Object>> getListSubjectAddCounterArgument(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            /*ModelAndView model = new ModelAndView("PhanGVPhanBien");
            model.addObject("person", personCurrent);*/
            List<Subject> subjectByCurrentLecturer = subjectRepository.findSubjectByAsisAdvisorAndMajor(true,existedLecturer.getMajor());
            /*model.addObject("listSubject",subjectByCurrentLecturer);
            return model;*/
            Map<String,Object> response = new HashMap<>();
            response.put("person",personCurrent);
            response.put("listSubject",subjectByCurrentLecturer);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/addCounterArgumrnt/{subjectId}/{lecturerId}")
    public ResponseEntity<?> addCounterArgumrnt(@PathVariable int subjectId, @RequestHeader("Authorization") String authorizationHeader, @PathVariable String lecturerId){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Subject existedSubject = subjectRepository.findById(subjectId).orElse(null);
            System.out.println("Chào");
            if (existedSubject != null) {
                Lecturer currentLecturer = lecturerRepository.findById(lecturerId).orElse(null);
                List<Subject> addSub = new ArrayList<>();
                addSub.add(existedSubject);
                if (currentLecturer != null) {
                    currentLecturer.setListSubCounterArgument(addSub);
                    existedSubject.setThesisAdvisorId(currentLecturer);
                    lecturerRepository.save(currentLecturer);
                    subjectRepository.save(existedSubject);
                }
            }
            /*String referer = Contains.URL_LOCAL + "/api/head/subject/listAdd";
            // Thực hiện redirect trở lại trang trước đó
            System.out.println("Url: " + referer);
            // Thực hiện redirect trở lại trang trước đó
            return new ModelAndView("redirect:" + referer);*/
            return new ResponseEntity<>(existedSubject, HttpStatus.OK);
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


    @GetMapping("/delete")
    public ResponseEntity<Map<String,Object>> getDanhSachDeTaiDaXoa(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            /*ModelAndView model = new ModelAndView("DeTaidaXoa_TBM");
            model.addObject("person", personCurrent);*/
            List<Subject> subjectByCurrentLecturer = subjectRepository.findSubjectByStatusAndMajorAndActive(false,existedLecturer.getMajor(),(byte) 0);
            /*model.addObject("listSubject",subjectByCurrentLecturer);
            return model;*/
            Map<String,Object> response = new HashMap<>();
            response.put("person",personCurrent);
            response.put("lstSubject",subjectByCurrentLecturer);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String,Object>> getDanhSachDeTai(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD")) {
            Lecturer existedLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            /*ModelAndView model = new ModelAndView("Duyet_TBM");
            model.addObject("person", personCurrent);*/
            List<Subject> subjectByCurrentLecturer = subjectRepository.findSubjectByStatusAndMajorAndActive(false,existedLecturer.getMajor(),(byte) 1);
            /*model.addObject("listSubject",subjectByCurrentLecturer);
            return model;*/
            Map<String,Object> response = new HashMap<>();
            response.put("person", personCurrent);
            response.put("listSubject", subjectByCurrentLecturer);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> lecturerRegisterTopic(@RequestParam("subjectName") String name,
                                              @RequestParam("requirement") String requirement,
                                              @RequestParam("expected") String expected,
                                              @RequestParam(value = "student1", required = false) String student1,
                                              @RequestParam(value = "student2", required = false) String student2,
                                              @RequestHeader("Authorization") String authorizationHeader,
                                              HttpServletRequest request) {

        try {
            LocalDateTime current = LocalDateTime.now();
            System.out.println(current);
            String token = tokenUtils.extractToken(authorizationHeader);
            Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
            if (personCurrent.getAuthorities().getName().equals("ROLE_LECTURER") || personCurrent.getAuthorities().getName().equals("ROLE_HEAD") ) {
                List<RegistrationPeriodLectuer> periodList = registrationPeriodLecturerRepository.findAllPeriod();
                if (CompareTime.isCurrentTimeInPeriodSLecturer(periodList)) {
                    Subject newSubject = new Subject();
                    newSubject.setSubjectName(name);
                    newSubject.setRequirement(requirement);
                    newSubject.setExpected(expected);
                    newSubject.setActive((byte) 1);
                    newSubject.setStatus(false);
                    //Tìm kiếm giảng viên hiện tại
                    Lecturer existLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
                    newSubject.setInstructorId(existLecturer);
                    newSubject.setMajor(existLecturer.getMajor());
                    //Tìm sinh viên qua mã sinh viên
                    Student studentId1 = studentRepository.findById(student1).orElse(null);
                    Student studentId2 = studentRepository.findById(student2).orElse(null);
                    if (studentId1 != null) {
                        newSubject.setStudentId1(studentId1);
                        newSubject.setStudent1(student1);
                        studentId1.setSubjectId(newSubject);
                    }
                    if (studentId2 != null) {
                        newSubject.setStudentId2(studentId2);
                        newSubject.setStudent2(student2);
                        studentId2.setSubjectId(newSubject);
                    }
                    LocalDate nowDate = LocalDate.now();
                    newSubject.setYear(String.valueOf(nowDate));
                    TypeSubject typeSubject = typeSubjectRepository.findById(1).orElse(null);
                    newSubject.setTypeSubject(typeSubject);
                    subjectRepository.save(newSubject);
                    studentRepository.save(studentId1);
                    studentRepository.save(studentId2);
                   /* String referer = Contains.URL_LOCAL + "/api/lecturer/subject";
                    // Thực hiện redirect trở lại trang trước đó
                    System.out.println("Url: " + referer);
                    // Thực hiện redirect trở lại trang trước đó
                    return new ModelAndView("redirect:" + referer);*/
                    return new ResponseEntity<>(newSubject, HttpStatus.CREATED);
                }else {
                    /*ModelAndView modelAndView = new ModelAndView("lecturer_registerError");
                    modelAndView.addObject("person", personCurrent);
                    return modelAndView;*/
                    return new ResponseEntity<>(personCurrent,HttpStatus.OK);
                }
            }
            else {
                /*odelAndView error = new ModelAndView();
                error.addObject("errorMessage", "Bạn không có quyền truy cập.");
                return error;*/
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        }catch (Exception e){
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "lỗi.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }


    @PostMapping("/browse/{id}")
    public ResponseEntity<?> browseSubject(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader, HttpServletRequest request){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD") ) {
            subjectService.browseSubject(id);
            Subject existSubject = subjectRepository.findById(id).orElse(null);
            String subject = "Topic: " + existSubject.getSubjectName() ;
            String messenger = "Topic: " + existSubject.getSubjectName() + " đã được duyệt!!";
            mailService.sendMailStudent(existSubject.getInstructorId().getPerson().getUsername(),subject,messenger);
            /*String referer = Contains.URL_LOCAL +  "/api/head/subject";
            // Thực hiện redirect trở lại trang trước đó
            System.out.println("Url: " + referer);
            // Thực hiện redirect trở lại trang trước đó
            return new ModelAndView("redirect:" + referer);*/
            return new ResponseEntity<>(HttpStatus.OK);
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable int id, @RequestHeader("Authorization") String authorizationHeader, HttpServletRequest request){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_HEAD") ) {
            Subject existSubject = subjectRepository.findById(id).orElse(null);
            existSubject.setActive((byte) 0);
            subjectRepository.save(existSubject);

            String subject = "Topic: " + existSubject.getSubjectName() ;
            String messenger = "Topic: " + existSubject.getSubjectName() + " đã bị xóa!!";
            mailService.sendMailStudent(existSubject.getInstructorId().getPerson().getUsername(),subject,messenger);
            /*tring referer = Contains.URL_LOCAL +  "/api/head/subject";
            // Thực hiện redirect trở lại trang trước đó
            System.out.println("Url: " + referer);
            // Thực hiện redirect trở lại trang trước đó
            return new ModelAndView("redirect:" + referer);*/
            return new ResponseEntity<>(HttpStatus.OK);
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/import")
    public ResponseEntity<?> importSubject(@RequestParam("file") MultipartFile file,  @RequestHeader("Authorization") String authorizationHeader) throws IOException {

        /*String referer = Contains.URL_LOCAL +  "/api/head/subject";
        return new ModelAndView("redirect:" + referer);*/
        return new ResponseEntity<>(service.importSubject(file,authorizationHeader), HttpStatus.OK);
    }
}