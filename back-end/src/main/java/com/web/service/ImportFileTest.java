package com.web.service;

import com.web.config.CheckRole;
import com.web.entity.*;
import com.web.repository.*;
import com.web.utils.UserUtils;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ImportFileTest {
    private final SubjectRepository subjectRepository;
    private final TypeSubjectRepository typeSubjectRepository;
    private final PersonRepository personRepository;
    private final UserUtils userUtils;
    private final LecturerRepository lecturerRepository;
    private final StudentRepository studentRepository;
    public ResponseEntity<?> importSubject(MultipartFile file) throws IOException {
        try {
            TypeSubject typeSubject = typeSubjectRepository.findById(1).orElse(null);
            LocalDate nowYear = LocalDate.now();
            if (checkExcelFormat(file)) {
                List<Subject> subjects = toSubjects(file.getInputStream());
                System.out.println(subjects);
                subjects.forEach(subject -> {
                    Subject newSubject = new Subject();
                    newSubject.setSubjectName(subject.getSubjectName());
                    newSubject.setYear(String.valueOf(nowYear));
                    newSubject.setTypeSubject(typeSubject);
                    newSubject.setActive((byte) 1);
                    newSubject.setStatus(false);
                    newSubject.setRequirement(subject.getRequirement());
                    newSubject.setExpected(subject.getExpected());
                    //subjectRepository.save(newSubject);
                    System.out.println("Luu Thanh Cong");
                });
                return ResponseEntity.ok("Imported file to list subject!");
            } else
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File upload is not match format, please try again!");
        }catch (Exception e){
            throw new RuntimeException("Lỗi r " + e.getMessage());
        }
    }

    public boolean checkExcelFormat(MultipartFile file){
        String contentType = file.getContentType();
        if (contentType == null) throw new AssertionError();
        return contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }
    public List<Subject> toSubjects(InputStream inputStream){
        List<Subject> subjects = new ArrayList<>();
        List<Map.Entry<Integer, Subject>> keyValueSubjectRow = new ArrayList<>();
        try{
            XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
            XSSFSheet sheet_HTTT = workbook.getSheet("HTTT_Đại trà");
            int rowNumber = 0;
            boolean foundHeader = false;
            boolean startedReading = false;

            for (Row row : sheet_HTTT) {
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }
                if (!foundHeader) { // Nếu chưa tìm thấy dòng tiêu đề
                    System.out.println("Trước khi check STT");
                    String rowName = row.getCell(0).getStringCellValue();
                    System.out.println("STT: " + rowName);
                    if (Objects.equals(rowName, "STT")) {
                        System.out.println("Nhay vào đây nè");
                        foundHeader = true; // Đánh dấu đã tìm thấy dòng tiêu đề
                    }
                    continue; // Bỏ qua dòng này và tiếp tục vòng lặp
                }
                if (!startedReading) {
                    startedReading = true; // Đánh dấu đã bắt đầu đọc từ hàng thứ hai sau dòng tiêu đề
                    continue; // Bỏ qua dòng này và tiếp tục vòng lặp
                }

                // 1 subjec excel - STT - MSSV - Tên Sv - Mã nhóm - Tên đề tài - GVHD (Mã GV - Tên GV) - GVPB (Mã GV - Tên GV)
                //New person: 1Student (MSSV - Tên SV), 2GV(GVHD - GVPB) -- Chỉ tạo lần đầu tiên gặp --> sau đó check person existed rồi gán
                //New subject: Tên đề tài, 2SVTH (Sau khi tạo mới person), GVHD, GVPB (tương tự student)
                // Bắt đầu mỗi hàng kiếm tra nếu cùng của 1 subject thì giữ nguyên object cũ, ngược lại tạo mới.
                Iterator<Cell> cells = row.iterator();
                Cell cellCheck = row.getCell(0);
                int cid = 1;
                if (cellCheck == null || cellCheck.getCellType() == CellType.BLANK){
                    //Là đề tài cũ.
                    //Lấy ra cặp key-subjectở hàng trước

                }else {
                    //Đề tài mới
                    Subject subject = new Subject();
                    int key = row.getRowNum();
                    while (cells.hasNext()) {
                        Cell cell = cells.next();
                        //Kiểm tra xem ô đầu tiên của hàng này có giá trị null k - double
                        //Nếu null thì đồng nghĩa với việc nó của cùng 1 subject
                        //Ngược lại nếu không null --> Subject tiếp theo
                        //đặt tên subject mới là subject[cid]
                        switch (cid) {
                            case 1 -> {
                                //STT
                                double a = cell.getNumericCellValue();
                            }
                            case 2 -> {
                                //Mã SV
                                /*System.out.println("Trước khi gán: " + cell.getStringCellValue());
                                subject.setSubjectName(cell.getStringCellValue());
                                System.out.println("Hàng 1: " + cell.getStringCellValue());*/
                                subject.setStudent1(cell.getStringCellValue());
                                Student student_1 = studentRepository.findById(cell.getStringCellValue()).orElse(null);
                            }
                            case 3 -> {
                                //Tên sinh viên
                                String nameStudent = cell.getStringCellValue();
                            }
                            case 4 -> {
                                //Mã nhóm
                                double group = cell.getNumericCellValue();
                            }
                            case 5 -> {
                                //Tên đề tài
                                subject.setSubjectName(cell.getStringCellValue());
                            }
                            case 6 -> {
                                //Mã GVHD
                                Lecturer instructor = lecturerRepository.findById(cell.getStringCellValue()).orElse(null);
                                subject.setInstructorId(instructor);
                            }
                            case 7 -> {
                                //Tên GVHD
                                String nameLec = cell.getStringCellValue();

                            }
                            case 8 -> {
                                //Mã GVPB
                                Lecturer thesis = lecturerRepository.findById(cell.getStringCellValue()).orElse(null);
                                subject.setInstructorId(thesis);

                            }
                            case 9 -> {
                                //Tên GVPB
                                String nameLec = cell.getStringCellValue();

                            }
                            default -> {
                                throw new IllegalStateException("Unsupported cell type at column " + cid + ", row " + row.getRowNum() +
                                        ". Cell type: " + cell.getCellType());
                            }
                        }
                        cid++;
                    }
                    keyValueSubjectRow.add(new AbstractMap.SimpleEntry<>(key,subject));
                    System.out.println("Hello: " + subject);
                    subjects.add(subject);
                }
            }


        } catch (Exception e){
            throw new RuntimeException("Error when convert file csv!" + e.getMessage());
        }
        return subjects;
    }


    //KKiểm tra 2 hàng gộp
    private boolean isCombinedRow(Row row) {
        int nonEmptyCellsCount = 0;

        // Đếm số ô không rỗng trong hàng
        for (Cell cell : row) {
            if (cell != null && !cell.toString().trim().isEmpty()) {
                nonEmptyCellsCount++;
            }
        }

        // Nếu số ô không rỗng lớn hơn một ngưỡng nào đó, giả sử rằng hàng đó không phải là kết hợp của hai hàng nhỏ
        return nonEmptyCellsCount > 2; // Bạn có thể điều chỉnh ngưỡng này tùy thuộc vào cấu trúc cụ thể của dữ liệu trong tệp Excel của bạn
    }
}
