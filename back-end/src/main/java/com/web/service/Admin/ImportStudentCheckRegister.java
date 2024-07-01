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
    private  final MailServiceImpl mailService;

    public String generateStudentListFile(List<Student> students, String filePath) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            writer.write("StudentId,First Name,Last Name,Email\n");
            for (Student student : students) {
                writer.write(student.getStudentId() + "," + student.getPerson().getFirstName() + "," + student.getPerson().getLastName()+ "," + student.getPerson().getUsername() + "\n");
            }
        }
        return filePath;
    }

    public ResponseEntity<?> importStudent(MultipartFile file) throws IOException {
        try {
            List<Student> updateStudents = new ArrayList<>();
            if (checkExcelFormat(file)) {
                List<Student> students = toStudents(file.getInputStream());
                //Lập một dnah sách
                List<String> studentIds = students.stream().map(Student::getStudentId).collect(Collectors.toList());
                for (Student student : students) {
                    Student oldStudent = studentRepository.findById(student.getStudentId()).orElse(null);
                    if (oldStudent != null) {
                        oldStudent.setStatus(true);
                        updateStudents.add(oldStudent);
                    } else {
                        // Thêm logic cho sinh viên mới nếu cần thiết
                        student.setStatus(true);
                        updateStudents.add(student);
                    }
                }
                //Các sv k nằm trong ds thì status=false
                studentRepository.saveAll(updateStudents);
                //Gửi mail cho các sv này thông báo:
                List<Student> studentList = studentRepository.getListStudentActiveTrue();
                List<String> emailLecturer = new ArrayList<>();
                for (Student student:studentList) {
                    emailLecturer.add(student.getPerson().getUsername());
                }
                String subject = "THÔNG BÁO ĐĂNG NHẬP ";
                String messenger = "Danh sách sinh viên được đăng ký đề tài trong đợt này đã có, vui lòng truy cập website hcmute.workon.space bằng mail sinh viên để đăng ký đề tài!!";

                String filePath = "student_list.csv";
                generateStudentListFile(studentList, filePath);

                if (!studentList.isEmpty()) {
                    mailService.sendMailWithAttachment(emailLecturer, subject, messenger, filePath);
                }
                List<Student> allStudents = studentRepository.findAll();
                List<Student> studentsToUpdate = new ArrayList<>();
                for (Student student : allStudents) {
                    if (!studentIds.contains(student.getStudentId())) {
                        student.setStatus(false);
                        studentsToUpdate.add(student);
                    }
                }
                studentRepository.saveAll(studentsToUpdate);

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
    public List<Student> toStudents(InputStream inputStream){
        List<Student> students = new ArrayList<>();
        try{
            XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
            XSSFSheet sheet = workbook.getSheet("student");
            int rowCount = sheet.getPhysicalNumberOfRows();
            for (int i = 1; i < rowCount; i++) {
                Row row = sheet.getRow(i);
                if (row != null) {
                    Student student = new Student(); // Tạo một đối tượng Student và Person cho mỗi hàng
                    // Duyệt qua từng ô trong hàng và đọc dữ liệu
                    for (int j = 0; j < row.getLastCellNum(); j++) {
                        Cell cell = row.getCell(j);
                        switch (j) {
                            case 0 -> {//ID
                                student.setStudentId(getCellValueAsString(cell));
                            }
                            default -> throw new IllegalStateException("Unsupported column index: " + j);
                        }
                    }
                    // Sau khi đọc dữ liệu từ một hàng, thêm đối tượng Subject vào danh sách
                    students.add(student);
                }
            }
        } catch (Exception e){
            throw new RuntimeException("Error when convert file csv!" + e.getMessage());
        }
        students.forEach(student -> {
            System.out.println("ID: " + student.getStudentId());
        });
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
