package com.web.service.Admin;

import com.web.config.TokenUtils;
import com.web.entity.*;
import com.web.repository.*;
import com.web.utils.UserUtils;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.NumberToTextConverter;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ImportStudent {
    private final SubjectRepository subjectRepository;
    private final TypeSubjectRepository typeSubjectRepository;
    private final StudentRepository studentRepository;
    private final SchoolYearRepository schoolYearRepository;
    private final StudentClassRepository studentClassRepository;
    private final PersonRepository personRepository;
    private final AuthorityRepository authorityRepository;

    public ResponseEntity<?> importStudent(MultipartFile file) throws IOException {
        try {
            Authority authority = authorityRepository.findByName("ROLE_STUDENT");
            boolean status = true;
            List<Student> saveStudents = new ArrayList<>();
            List<Person> savePersons = new ArrayList<>();
            if (checkExcelFormat(file)) {
                Map<String, List<?>> result = toStudents(file.getInputStream());
                List<Student> students = (List<Student>) result.get("Students");
                List<Person> persons = (List<Person>) result.get("Persons");
                if (persons.size() == students.size()) {
                    for (int i=0;i< persons.size();i++) {
                        Person person = persons.get(i);
                        Student student = students.get(i);
                        Person newPerson = new Person();
                        newPerson.setPersonId(person.getPersonId());
                        newPerson.setActived(true);
                        newPerson.setAddress(person.getAddress());
                        newPerson.setBirthDay(person.getBirthDay());
                        newPerson.setFirstName(person.getFirstName());
                        newPerson.setGender(person.isGender());
                        newPerson.setLastName(person.getLastName());
                        newPerson.setPhone(person.getPhone());
                        newPerson.setStatus(status);
                        newPerson.setUsername(person.getUsername());
                        newPerson.setAuthorities(authority);
                        savePersons.add(newPerson);
                        Student newStudent = new Student();
                        newStudent.setStudentId(student.getStudentId());
                        newStudent.setStudentClass(student.getStudentClass());
                        newStudent.setMajor(student.getMajor());
                        newStudent.setSchoolYear(student.getSchoolYear());
                        saveStudents.add(newStudent);
                        System.out.println("Đọc và sao chép thành công");
                    }
                }else {
                    System.out.println("Số lượng Person và Student không khớp");
                }
                personRepository.saveAll(savePersons);
                studentRepository.saveAll(saveStudents);
                return ResponseEntity.ok("Imported file to list subject successful!");
            } else
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File upload is not match format, please try again!");
        }catch (Exception e){
            throw new RuntimeException("Lỗi r" + e);
        }
    }


    public boolean checkExcelFormat(MultipartFile file){
        String contentType = file.getContentType();
        if (contentType == null) throw new AssertionError();
        return contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }
    public Map<String,List<?>> toStudents(InputStream inputStream){
        List<Student> students = new ArrayList<>();
        List<Person> persons = new ArrayList<>();
        try{
            XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
            XSSFSheet sheet = workbook.getSheet("student");
            int rowCount = sheet.getPhysicalNumberOfRows();
            for (int i = 1; i < rowCount; i++) {
                Row row = sheet.getRow(i);
                if (row != null) {
                    Student student = new Student(); // Tạo một đối tượng Student và Person cho mỗi hàng
                    Person person = new Person();
                    // Duyệt qua từng ô trong hàng và đọc dữ liệu
                    for (int j = 0; j < row.getLastCellNum(); j++) {
                        Cell cell = row.getCell(j);
                        switch (j) {
                            case 0 -> {//ID
                                person.setPersonId(getCellValueAsString(cell));
                                student.setStudentId(getCellValueAsString(cell));
                            }
                            case 1 -> { //firstname
                                person.setFirstName(getCellValueAsString(cell));
                            }
                            case 2 -> person.setLastName(getCellValueAsString(cell)); //lastname
                            case 3 -> person.setAddress(getCellValueAsString(cell)); //address
                            case 4 ->{ //phone
                                person.setPhone(getCellValueAsString(cell));
                                System.out.println("Phone");
                            }
                            case 5 ->{ //class
                                System.out.println("trước class");
                                StudentClass studentClass = studentClassRepository.getStudentClassByClassname(getCellValueAsString(cell));
                                student.setStudentClass(studentClass);
                                System.out.println("sau class");
                            }
                            case 6 ->{//year
                                System.out.println("trước year");
                                SchoolYear schoolYear = schoolYearRepository.getSchoolYearByYear(getCellValueAsString(cell));
                                student.setSchoolYear(schoolYear);
                                System.out.println("sau year");
                            }
                            case 7 ->{//email
                                System.out.println("trước email");
                                Person existedPerson = personRepository.findUsername(getCellValueAsString(cell));
                                if (existedPerson==null){
                                    person.setUsername(getCellValueAsString(cell));
                                    System.out.println("sau email");
                                }
                            }
                            case 8 ->{//gender
                                System.out.println("trước gt");
                                person.setGender(Boolean.parseBoolean(getCellValueAsString(cell)));
                                System.out.println("sau gt");
                            }
                            case 9 ->{//major
                                System.out.println("trước major");
                                student.setMajor(Major.valueOf(getCellValueAsString(cell)));
                                System.out.println("sau major");
                            }
                            case 10->{//birthday
                                System.out.println("trước bd");
                                person.setBirthDay(getCellValueAsString(cell));
                                System.out.println("sau bd");
                            }
                            default -> throw new IllegalStateException("Unsupported column index: " + j);
                        }
                    }
                    // Sau khi đọc dữ liệu từ một hàng, thêm đối tượng Subject vào danh sách
                    students.add(student);
                    persons.add(person);
                }
            }
        } catch (Exception e){
            throw new RuntimeException("Error when convert file csv!" + e.getMessage());
        }
        students.forEach(student -> {
            System.out.println("ID: " + student.getStudentId());
            System.out.println("Major: " + student.getMajor());
            System.out.println("Class: " + student.getStudentClass());
            System.out.println("Year: " + student.getSchoolYear());

        });
        persons.forEach(person -> {
            System.out.println("ID: " + person.getPersonId());
            System.out.println("FName: " + person.getFirstName());
            System.out.println("LName: " + person.getLastName());
            System.out.println("Address: " + person.getAddress());
            System.out.println("Phone: " + person.getPhone());
            System.out.println("email: " + person.getUsername());
            System.out.println("gender: " + person.isGender());
            System.out.println("birthday: " + person.getBirthDay());
        });
        Map<String,List<?>> response = new HashMap<>();
        response.put("Students",students);
        response.put("Persons",persons);

        return response;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null || cell.getCellType() == CellType.BLANK) {
            return null;
        } else if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue();
        } else if (cell.getCellType() == CellType.NUMERIC) {
            if (DateUtil.isCellDateFormatted(cell)) {
                // Nếu là ngày tháng, chuyển đổi sang chuỗi theo định dạng mong muốn
                SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
                return dateFormat.format(cell.getDateCellValue());
            } else {
                // Kiểm tra nếu giá trị số có dạng chuỗi
                if (NumberToTextConverter.toText(cell.getNumericCellValue()).contains("E")) {
                    // Nếu có dạng chuỗi, sử dụng phương thức toText để chuyển đổi giá trị số thành chuỗi
                    return NumberToTextConverter.toText(cell.getNumericCellValue());
                } else {
                    // Nếu không, chuyển đổi giá trị số thành chuỗi
                    return String.valueOf((long) cell.getNumericCellValue());
                }
            }
        } else {
            throw new IllegalStateException("Unsupported cell type: " + cell.getCellType());
        }
    }
}
