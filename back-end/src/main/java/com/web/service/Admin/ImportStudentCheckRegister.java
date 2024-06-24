package com.web.service.Admin;

import com.web.entity.*;
import com.web.repository.*;
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

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
@RequiredArgsConstructor
public class ImportStudentCheckRegister {
    private final StudentRepository studentRepository;

    public ResponseEntity<?> importStudent(MultipartFile file) throws IOException {
        try {
            List<Student> updateStudents = new ArrayList<>();
            if (checkExcelFormat(file)) {
                List<Student> students = toStudents(file.getInputStream());
                for (Student student : students) {
                    Student oldStudent = studentRepository.findById(student.getStudentId()).orElse(null);
                    if (oldStudent != null) {
                        oldStudent.setStatus(true);
                        updateStudents.add(oldStudent);
                    } else {
                        System.err.println("Student not found: " + student.getStudentId());
                    }
                }
                studentRepository.saveAll(updateStudents);
                return ResponseEntity.ok("Imported file and updated students successfully!");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File upload is not in the correct format. Please try again!");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error during import: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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
                    Student student = new Student();
                    for (int j = 0; j < row.getLastCellNum(); j++) {
                        Cell cell = row.getCell(j);
                        if (j == 0) {
                            student.setStudentId(getCellValueAsString(cell));
                        } else {
                            throw new IllegalStateException("Unsupported column index: " + j);
                        }
                    }
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
                SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
                return dateFormat.format(cell.getDateCellValue());
            } else {
                if (NumberToTextConverter.toText(cell.getNumericCellValue()).contains("E")) {
                    return NumberToTextConverter.toText(cell.getNumericCellValue());
                } else {
                    return String.valueOf((long) cell.getNumericCellValue());
                }
            }
        } else {
            throw new IllegalStateException("Unsupported cell type: " + cell.getCellType());
        }
    }
}

