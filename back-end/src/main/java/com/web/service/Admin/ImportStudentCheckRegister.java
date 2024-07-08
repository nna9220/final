package com.web.service.Admin;

import com.web.entity.*;
import com.web.repository.*;
import com.web.service.MailServiceImpl;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImportStudentCheckRegister {
    private final SubjectRepository subjectRepository;
    private final TypeSubjectRepository typeSubjectRepository;
    private final StudentRepository studentRepository;
    private final SchoolYearRepository schoolYearRepository;
    private final StudentClassRepository studentClassRepository;
    private final PersonRepository personRepository;
    private final AuthorityRepository authorityRepository;
    private final MailServiceImpl mailService;

    public String generateStudentListFile(List<Student> students, String filePath) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            writer.write("StudentId,First Name,Last Name,Email\n");
            for (Student student : students) {
                writer.write(student.getStudentId() + "," + student.getPerson().getFirstName() + "," + student.getPerson().getLastName() + "," + student.getPerson().getUsername() + "\n");
            }
        }
        return filePath;
    }

    @Transactional
    public ResponseEntity<?> importStudent(MultipartFile file) throws IOException {
        try {
            List<Student> students = new ArrayList<>();
            if (!checkExcelFormat(file)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File upload is not in the correct format, please try again!");
            }
            students = toStudents(file.getInputStream());

            List<String> studentIds = students.stream().map(Student::getStudentId).collect(Collectors.toList());
            List<Student> existingStudents = studentRepository.findAllById(studentIds);

            List<Student> updateStudents = new ArrayList<>();
            for (Student existingStudent : existingStudents) {
                existingStudent.setStatus(true);
                updateStudents.add(existingStudent);
            }
            studentRepository.saveAll(updateStudents);

            List<Student> studentsToDeactivate = studentRepository.findAll().stream()
                    .filter(student -> !studentIds.contains(student.getStudentId()))
                    .collect(Collectors.toList());

            for (Student student : studentsToDeactivate) {
                student.setStatus(false);
            }
            studentRepository.saveAll(studentsToDeactivate);

            List<Student> studentList = studentRepository.getListStudentActiveTrue();
            List<String> emailLecturer = new ArrayList<>();
            for (Student s:studentList) {
                System.out.println("Student: " + s.getPerson().getUsername());
                emailLecturer.add(s.getPerson().getUsername());
            }

            if (emailLecturer.isEmpty()) {
                throw new RuntimeException("No valid recipient email addresses found.");
            }

            String subject = "THÔNG BÁO ĐĂNG NHẬP ";
            String messenger = "Danh sách sinh viên được đăng ký đề tài trong đợt này đã có, vui lòng truy cập website hcmute.workon.space bằng mail sinh viên để đăng ký đề tài!!";

            String filePath = "student_list.csv";
            generateStudentListFile(studentList, filePath);

            if (filePath == null || filePath.isEmpty()) {
                throw new RuntimeException("Generated file path is null or empty.");
            }

            mailService.sendMailWithAttachment(emailLecturer, subject, messenger, filePath);

            return ResponseEntity.ok("Imported file to list subject successful!");
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while importing students: " + e.getMessage(), e);
        }
    }
    public boolean checkExcelFormat(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null) throw new AssertionError();
        return contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    public List<Student> toStudents(InputStream inputStream) {
        List<Student> students = new ArrayList<>();
        try {
            XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
            XSSFSheet sheet = workbook.getSheet("student");
            int rowCount = sheet.getPhysicalNumberOfRows();
            for (int i = 1; i < rowCount; i++) {
                Row row = sheet.getRow(i);
                if (row != null) {
                    Student student = new Student(); // Tạo một đối tượng Student cho mỗi hàng
                    // Duyệt qua từng ô trong hàng và đọc dữ liệu
                    for (int j = 0; j < row.getLastCellNum(); j++) {
                        Cell cell = row.getCell(j);
                        if (cell == null) continue;
                        switch (j) {
                            case 0: // ID
                                student.setStudentId(getCellValueAsString(cell));
                                break;
                            default:
                                throw new IllegalStateException("Unsupported column index: " + j);
                        }
                    }
                    // Sau khi đọc dữ liệu từ một hàng, thêm đối tượng Student vào danh sách
                    students.add(student);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error when converting file to students: " + e.getMessage());
        }
        students.forEach(student -> System.out.println("ID: " + student.getStudentId()));
        return students;
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
