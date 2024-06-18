package com.web.controller.admin;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;
import com.web.config.CheckRole;
import com.web.config.JwtUtils;
import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.exception.NotFoundException;
import com.web.mapper.StudentClassMapper;
import com.web.dto.request.StudentClassRequest;
import com.web.repository.PersonRepository;
import com.web.repository.StudentClassRepository;
import com.web.service.Admin.StudentClassService;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/studentClass")
public class StudentClassController {
    @Autowired
    private StudentClassService studentClassService;
    @Autowired
    private StudentClassMapper studentClassMapper;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private StudentClassRepository studentClassRepository;
    private final TokenUtils tokenUtils;
    @Autowired
    public StudentClassController (TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String,Object>> getStudentClass(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person person = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (person.getAuthorities().getName().equals("ROLE_ADMIN")) {
            List<StudentClass> studentClasses = studentClassService.findAll();
            Map<String,Object> response = new HashMap<>();
            response.put("listClass", studentClasses);
            response.put("person", person);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> saveClass(@RequestParam("className") String className, HttpServletRequest request, RedirectAttributes redirectAttributes){

        StudentClassRequest studentClass = new StudentClassRequest();
        studentClass.setClassname(className);
        studentClass.setStatus(true);
        studentClassService.createStudentClass(studentClass);

        return new ResponseEntity<>(studentClass,HttpStatus.CREATED);
    }

    @GetMapping("/{classId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String,Object>> editClass(HttpSession session,@PathVariable int classId) {
        // Lấy thông tin lớp học cần chỉnh sửa từ service
        StudentClass studentClass = studentClassService.getStudentClassById(classId);
        Person personCurrent = CheckRole.getRoleCurrent(session,userUtils,personRepository);

        // Kiểm tra xem lớp học có tồn tại không
        if (studentClass != null) {
            // Trả về ModelAndView với thông tin lớp học và đường dẫn của trang chỉnh sửa
            /*ModelAndView model = new ModelAndView("admin_editClass");
            model.addObject("studentClass", studentClass);
            model.addObject("person", personCurrent);

            return model;*/
            Map<String,Object> response = new HashMap<>();
            response.put("person", personCurrent);
            response.put("studentClass",studentClass);
            return new ResponseEntity<>(response,HttpStatus.OK);
        } else {
            // Trả về ModelAndView với thông báo lỗi nếu không tìm thấy lớp học
            /*ModelAndView errorModel = new ModelAndView("error");
            errorModel.addObject("errorMessage", "Không tìm thấy lớp học");
            return errorModel;*/
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
   @PostMapping("/edit/{classId}")
   @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateStudentClass(@PathVariable int classId, @ModelAttribute StudentClassRequest studentClass, @ModelAttribute("successMessage") String successMessage){
        StudentClass existStudentClass = studentClassService.getStudentClassById(classId);
       /*if (CheckedPermission.isAdmin(personRepository)){*/
           if (existStudentClass != null){
               existStudentClass.setClassname(studentClass.getClassname());
               existStudentClass.setStatus(true);
               studentClassRepository.save(existStudentClass);
               return new ResponseEntity<>(existStudentClass,HttpStatus.OK);
           }else {
               return new ResponseEntity<>(HttpStatus.NOT_FOUND);
           }
       /*}else {
           return new ResponseEntity<>(HttpStatus.FORBIDDEN);
       }*/
    }

    @PostMapping("/deleted/{classId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deletedClass(@PathVariable int classId){
        StudentClass existStudentClass = studentClassService.getStudentClassById(classId);
        if (existStudentClass != null){
            studentClassRepository.delete(existStudentClass);
            return new ResponseEntity<>(existStudentClass,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/export")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void exportStudentClasses(HttpServletResponse response) throws IOException {
        response.setContentType("application/vnd.ms-excel");
        response.setHeader("Content-Disposition", "attachment;filename=student_classes.xls");

        List<StudentClass> studentClasses = studentClassService.findAll();

        Workbook workbook = new HSSFWorkbook();
        Sheet sheet = workbook.createSheet("Student Classes");

        // Tạo header row
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("ID");
        headerRow.createCell(1).setCellValue("Class Name");
        headerRow.createCell(2).setCellValue("Status");

        // Fill data rows
        int rowNum = 1;
        for (StudentClass studentClass : studentClasses) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(studentClass.getId());
            row.createCell(1).setCellValue(studentClass.getClassname());
            row.createCell(2).setCellValue(studentClass.isStatus());
        }

        // Write the output to the response output stream
        try (OutputStream out = response.getOutputStream()) {
            workbook.write(out);
        }

        // Close the workbook
        workbook.close();
    }
}
