package com.web.controller.admin;

//import hcmute.edu.vn.registertopic_be.authentication.CheckedPermission;
import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.dto.request.StudentClassRequest;
import com.web.entity.*;
import com.web.mapper.StudentMapper;
import com.web.dto.request.PersonRequest;
import com.web.dto.request.StudentRequest;
import com.web.repository.*;
import com.web.service.Admin.*;
import com.web.utils.Contains;
import com.web.utils.UserUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.OutputStream;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.persistence.EntityManager;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.xml.crypto.Data;

@RestController
@RequestMapping("/api/admin/student")
public class StudentController {
    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);
    @Autowired
    private StudentClassRepository studentClassRepository;
    @Autowired
    private StudentService studentService;
    @Autowired
    private StudentMapper studentMapper;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private SchoolYearRepository schoolYearRepository;
    @Autowired
    private PersonService personService;
    @Autowired
    private ImportStudent importStudent;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private StudentClassService studentClassService;
    @Autowired
    private SchoolYearService schoolYearService;
    @Autowired
    private StudentRepository studentRepository;
    private final TokenUtils tokenUtils;
    @Autowired
    private AuthorityRepository authorityRepository;
    @Autowired
    public StudentController (TokenUtils tokenUtils){
        this.tokenUtils = tokenUtils;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String,Object>> getAllStudent(@RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            List<StudentClass> studentClasses = studentClassService.findAll();
            List<SchoolYear> schoolYears = schoolYearService.findAll();
            List<Student> studentList = studentService.getAllStudent();
            Authority authority = authorityRepository.findByName(Contains.ROLE_GUEST);
            List<Person> personList = personRepository.findGuest(authority);
            System.out.println(personCurrent.getUsername());
            Map<String,Object> response = new HashMap<>();
            response.put("person", personCurrent);
            response.put("listClass", studentClasses);
            response.put("major", Major.values());
            response.put("listYear", schoolYears);
            response.put("students", studentList);
            response.put("guest", personList);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else {
            /*ModelAndView error = new ModelAndView();
            error.addObject("errorMessage", "Bạn không có quyền truy cập.");
            return error;*/
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createStudentAndPerson(
            @RequestParam(value = "personId", required = true) String personId,
            @RequestParam(value = "firstName", required = true) String firstName,
            @RequestParam(value = "lastName", required = true) String lastName,
            @RequestParam(value = "email", required = true) String email,
            @RequestParam(value = "gender", required = true) Boolean gender,
            @RequestParam(value = "birthDay", required = true) String birthDay,
            @RequestParam(value = "phone", required = true) String phone,
            @RequestParam(value = "major", required = true) Major major,
            @RequestParam(value = "id") int id,
            @RequestParam(value = "year") int yearId,
            @RequestHeader("Authorization") String authorizationHeader, HttpServletRequest request) {
        try {
            System.out.println("Class " + id);
            System.out.println("Year" + yearId);
            String token = tokenUtils.extractToken(authorizationHeader);
            Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
            if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {

                // Check if the personId or email already exists
                if (personRepository.existsByPersonId(personId)) {
                    return new ResponseEntity<>("MSSV đã tồn tại", HttpStatus.CONFLICT);
                }
                if (personRepository.existsByUsername(email)) {
                    return new ResponseEntity<>("Email đã tồn tại", HttpStatus.CONFLICT);
                }

                Person newPerson = new Person();
                newPerson.setPersonId(personId);
                newPerson.setFirstName(firstName);
                newPerson.setLastName(lastName);
                newPerson.setUsername(email);
                newPerson.setGender(gender);
                newPerson.setBirthDay(birthDay);
                newPerson.setPhone(phone);
                Authority authority = new Authority();
                authority.setName("ROLE_STUDENT");
                newPerson.setAuthorities(authority);
                newPerson.setStatus(true);

                var person = personRepository.save(newPerson);
                System.out.println(person.getPersonId());
                System.out.println(newPerson.getPersonId() + " " + newPerson.getLastName());

                // Create Student -> take id from the newly created person
                StudentRequest newStudent = new StudentRequest();
                newStudent.setStudentId(personId);
                newStudent.setPersonId(newPerson);
                newStudent.setMajor(major.name());

                StudentClass existedClass = studentClassRepository.findById(id).orElse(null);
                if (existedClass != null) {
                    newStudent.setStudentClass(existedClass);
                }
                SchoolYear existedYear = schoolYearRepository.findById(yearId).orElse(null);
                if (existedYear != null) {
                    newStudent.setSchoolYear(existedYear);
                }

                studentService.saveStudent(newStudent);
                return new ResponseEntity<>(newStudent, HttpStatus.CREATED);

            } else {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
        } catch (Exception e) {
            logger.info(e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String,Object>> editStudent(@PathVariable String id,
                                                          @RequestHeader("Authorization") String authorizationHeader){
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token,userUtils,personRepository);
        System.out.println("Start");
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            System.out.println("Before existedStudent null");
            Student existStudent = studentRepository.findById(id).orElse(null);;
            if (existStudent!=null){
                System.out.println("After existedStudent null");
                Person person = personRepository.findById(existStudent.getStudentId()).orElse(null);
                List<StudentClass> studentClasses = studentClassService.findAll();
                List<SchoolYear> schoolYears = schoolYearService.findAll();
                Map<String,Object> response= new HashMap<>();
                response.put("student",existStudent);
                response.put("person", person);
                response.put("listClass", studentClasses);
                response.put("major", Major.values());
                response.put("listYear", schoolYears);
                return new ResponseEntity<>(response,HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }



    @Autowired
    private EntityManager entityManager;

    @PostMapping("/edit/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable String id,
                                        @RequestParam("firstName") String firstName,
                                        @RequestParam("lastName") String lastName,
                                        @RequestParam("birthDay") String birthDay,
                                        @RequestParam("phone") String phone,
                                        @RequestParam("gender") boolean gender,
                                        @RequestParam(value = "status", required = false, defaultValue = "true") boolean status,
                                        @RequestParam("username") String username,
                                        @RequestParam("address") String address,
                                        @RequestParam("classes") String classes,
                                        @RequestParam("major") String major, // Thêm trường chuyên ngành
                                        @RequestHeader("Authorization") String authorizationHeader) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);

        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            Person existPerson = personRepository.findById(id).orElse(null);
            Student existStudent = studentRepository.findById(id).orElse(null);
            if (existPerson != null && existStudent != null) {
                existPerson.setFirstName(firstName);
                existPerson.setLastName(lastName);
                existPerson.setBirthDay(birthDay);
                existPerson.setAddress(address);
                existPerson.setUsername(username);
                existPerson.setPhone(phone);
                existPerson.setGender(gender);
                existPerson.setStatus(status);
                existStudent.setMajor(Major.valueOf(major)); // Cập nhật chuyên ngành
                StudentClass studentClass = studentClassRepository.getStudentClassByClassname(classes);
                existStudent.setStudentClass(studentClass);
                personRepository.save(existPerson);
                studentRepository.save(existStudent);
                return new ResponseEntity<>(existPerson, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteStudent(@PathVariable String id, @RequestHeader("Authorization") String authorizationHeader) {
        String token = tokenUtils.extractToken(authorizationHeader);
        Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
        if (personCurrent.getAuthorities().getName().equals("ROLE_ADMIN")) {
            Person editPerson = personRepository.findById(id).orElse(null);

            if (editPerson != null) {
                editPerson.setStatus(false);
                personRepository.save(editPerson);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
           return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

/*    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable String id, @RequestHeader("Authorization") String authorizationHeader) {
                Student student = studentRepository.findById(id).orElse(null);
                if (student!=null) {
                    studentRepository.delete(student);
                }
                return new ResponseEntity<>(HttpStatus.OK);
    }*/

    @PostMapping("/importSV")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> importStudent(@RequestParam("file") MultipartFile file) throws IOException {
        return new ResponseEntity<>(importStudent.importStudent(file),HttpStatus.OK);
    }


    @GetMapping("/export")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void exportStudent(HttpServletResponse response) throws IOException {
        response.setContentType("application/vnd.ms-excel");
        response.setHeader("Content-Disposition", "attachment;filename=student_classes.xls");

        List<Student> student = studentService.getAllStudent();

        Workbook workbook = new HSSFWorkbook();
        Sheet sheet = workbook.createSheet("Student Classes");

        // Tạo header row
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("ID");
        headerRow.createCell(1).setCellValue("Class Name");
        headerRow.createCell(2).setCellValue("Status");

        // Fill data rows
        int rowNum = 1;
        for (Student student1 : student) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(student1.getStudentId());
            row.createCell(1).setCellValue(student1.getPerson().getLastName());
            row.createCell(2).setCellValue(student1.getPerson().getFirstName());
        }

        // Write the output to the response output stream
        try (OutputStream out = response.getOutputStream()) {
            workbook.write(out);
        }

        // Close the workbook
        workbook.close();
    }


}
