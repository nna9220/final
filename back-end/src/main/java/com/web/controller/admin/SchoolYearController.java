package com.web.controller.admin;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;
import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.dto.response.LecturerResponse;
import com.web.dto.response.SchoolYearResponse;
import com.web.entity.*;
import com.web.config.JwtUtils;
import com.web.dto.request.StudentClassRequest;
import com.web.mapper.SchoolYearMapper;
import com.web.dto.request.SchoolYearRequest;
import com.web.repository.PersonRepository;
import com.web.repository.SchoolYearRepository;
import com.web.service.Admin.SchoolYearService;
import com.web.utils.Contains;
import com.web.utils.UserUtils;
import io.jsonwebtoken.Claims;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/schoolYear")
public class SchoolYearController {
    @Autowired
    private SchoolYearService schoolYearService;
    @Autowired
    private SchoolYearMapper schoolYearMapper;
    @Autowired
    private SchoolYearRepository schoolYearRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;

    private final TokenUtils tokenUtils;
    @Autowired
    public SchoolYearController (TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }
    @GetMapping
    public ResponseEntity<Map<String,Object>> getSchoolYear(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person person = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (person.getAuthorities().getName().equals("ROLE_ADMIN")) {
            List<SchoolYear> schoolYears = schoolYearService.findAll();
        /*ModelAndView model = new ModelAndView("QuanLyLopHoc");
        model.addObject("listClass", studentClasses);
        model.addObject("person", person);
        return model;*/
            Map<String,Object> response = new HashMap<>();
            response.put("listYear", schoolYears);
            response.put("person", person);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> saveSchoolYear(@RequestParam("year") String schoolYearRequest, HttpServletRequest request){
        String referer = request.getHeader("Referer");
        SchoolYearRequest schoolYearRequest1 = new SchoolYearRequest();
        schoolYearRequest1.setYear(schoolYearRequest);
        schoolYearService.createSchoolYear(schoolYearRequest1);
        /*return new ModelAndView("redirect:" + referer);*/
        return new ResponseEntity<>(schoolYearRequest1,HttpStatus.CREATED);
    }

    @GetMapping("/{yearId}")
    public ResponseEntity<Map<String,Object>> editClass(HttpSession session, @PathVariable int yearId) {
        // Lấy thông tin lớp học cần chỉnh sửa từ service
        SchoolYear schoolYear = schoolYearRepository.findById(yearId).orElse(null);
        Person personCurrent = CheckRole.getRoleCurrent(session,userUtils,personRepository);
        // Kiểm tra xem lớp học có tồn tại không
        if (schoolYear != null) {
            // Trả về ModelAndView với thông tin lớp học và đường dẫn của trang chỉnh sửa
            /*ModelAndView model = new ModelAndView("admin_editYear");
            model.addObject("schoolYear", schoolYear);
            model.addObject("person", personCurrent);
            return model;*/
            Map<String,Object> response = new HashMap<>();
            response.put("schoolYear", schoolYear);
            response.put("person",personCurrent);
            return new ResponseEntity<>(response, HttpStatus.OK);}
        else {
            // Trả về ModelAndView với thông báo lỗi nếu không tìm thấy lớp học
            /*ModelAndView errorModel = new ModelAndView("error");
            errorModel.addObject("errorMessage", "Không tìm thấy lớp học");
            return errorModel;*/
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @PostMapping("/edit/{yearId}")
    public ResponseEntity<?> updateYear(@PathVariable int yearId, @ModelAttribute SchoolYearRequest schoolYearRequest, @ModelAttribute("successMessage") String successMessage){
        SchoolYear existSchoolYear = schoolYearRepository.findById(yearId).orElse(null);
        if (existSchoolYear != null){
            existSchoolYear.setYear(schoolYearRequest.getYear());
            schoolYearRepository.save(existSchoolYear);
            String url = Contains.URL + "/api/admin/schoolYear";
            /*ModelAndView model = new ModelAndView("redirect:" + url);

            model.addObject("successMessage", successMessage);
            return model;*/
            return new ResponseEntity<>(existSchoolYear, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/export")
    public void exportSchoolYear(HttpServletResponse response) throws IOException {
        response.setContentType("application/vnd.ms-excel");
        response.setHeader("Content-Disposition", "attachment;filename=student_classes.xls");

        List<SchoolYear> schoolYears = schoolYearService.findAll();

        Workbook workbook = new HSSFWorkbook();
        Sheet sheet = workbook.createSheet("Student Classes");

        // Tạo header row
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("ID");
        headerRow.createCell(1).setCellValue("SchoolYear");
        // Fill data rows
        int rowNum = 1;
        for (SchoolYear schoolYear : schoolYears) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(schoolYear.getYearId());
            row.createCell(1).setCellValue(schoolYear.getYear());
        }

        // Write the output to the response output stream
        try (OutputStream out = response.getOutputStream()) {
            workbook.write(out);
        }

        // Close the workbook
        workbook.close();
    }

}
