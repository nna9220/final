package com.web.service.Admin;

import com.web.config.TokenUtils;
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

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SubjectImportTLCN {

    private final SubjectRepository subjectRepository;
    private final TypeSubjectRepository typeSubjectRepository;
    private final PersonRepository personRepository;
    private final UserUtils userUtils;
    private final LecturerRepository lecturerRepository;
    private final StudentRepository studentRepository;
    private final CouncilRepository councilRepository;
    private final TokenUtils tokenUtils;
    private final CouncilLecturerRepository councilLecturerRepository;
    private final EvaluationCriteriaRepository evaluationCriteriaRepository;

    public ResponseEntity<?> importSubject(MultipartFile file) throws IOException {

            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Tiểu luận chuyên ngành");

            List<Subject> saveSub = new ArrayList<>();
            Set<Student> saveStudent = new HashSet<>();
            List<Council> saveCouncil =new ArrayList<>();
            List<Lecturer> saveLecturer = new ArrayList<>();
            List<CouncilLecturer> councilLecturers = new ArrayList<>();
            LocalDate nowYear = LocalDate.now();
            if (checkExcelFormat(file)) {
                List<Subject> tlcn = toSubjects(file.getInputStream());
                //TLCN
                tlcn.forEach(subject -> {
                    Subject newSubject = new Subject();
                    newSubject.setSubjectName(subject.getSubjectName());
                    newSubject.setYear(String.valueOf(nowYear));
                    newSubject.setTypeSubject(typeSubject);
                    newSubject.setActive((byte) 1);
                    newSubject.setStatus(true);
                    if (subject.getStudent1()!=null) {
                        Student student1 = studentRepository.findById(subject.getStudent1()).orElse(null);
                        if (student1 != null) {
                            if (student1.getSubjectId() == null) {
                                newSubject.setStudent1(subject.getStudent1());
                                student1.setSubjectId(newSubject);
                                newSubject.setMajor(student1.getMajor());
                                saveStudent.add(student1);
                            }
                        }
                    }else {
                        newSubject.setStudent1(null);
                    }
                    if (subject.getStudent2()!=null) {
                        Student student2 = studentRepository.findById(subject.getStudent2()).orElse(null);
                        if (student2 != null) {
                            if (student2.getSubjectId() == null) {
                                newSubject.setStudent2(subject.getStudent2());
                                student2.setSubjectId(newSubject);
                                saveStudent.add(student2);
                            }
                        }
                    }else {
                        newSubject.setStudent2(null);
                    }
                    if (subject.getStudent3()!=null) {
                        Student student3 = studentRepository.findById(subject.getStudent3()).orElse(null);
                        if (student3 != null) {
                            if (student3.getSubjectId() == null) {
                                newSubject.setStudent3(subject.getStudent3());
                                student3.setSubjectId(newSubject);
                                saveStudent.add(student3);
                            }
                        }
                    }else {
                        newSubject.setStudent3(null);
                    }
                    if (subject.getInstructorId()!=null) {
                        newSubject.setInstructorId(subject.getInstructorId());
                    }
                    if (subject.getThesisAdvisorId()!=null) {
                        System.out.println("GVPB subject: " + subject.getThesisAdvisorId());
                        System.out.println("GVHD subject: " + subject.getInstructorId());
                        Lecturer instructor = subject.getInstructorId();
                        Lecturer thesis = subject.getThesisAdvisorId();
                        newSubject.setThesisAdvisorId(subject.getThesisAdvisorId());
                        Council newCouncil = new Council();
                        newCouncil.setSubject(newSubject);
                        // Tạo CouncilLecturer của GVPB
                        CouncilLecturer councilCounterArgument = new CouncilLecturer();
                        councilCounterArgument.setLecturer(subject.getThesisAdvisorId());
                        councilCounterArgument.setRole("Chủ tịch");
                        councilCounterArgument.setCouncil(newCouncil);
                        newSubject.setCouncil(newCouncil);

                        // Tạo CouncilLecturer của GVHD
                        CouncilLecturer councilInstructor = new CouncilLecturer();
                        councilInstructor.setLecturer(subject.getInstructorId());
                        councilInstructor.setRole("Ủy viên");
                        councilInstructor.setCouncil(newCouncil);

                        newCouncil.setCouncilLecturers(councilLecturers);
                        boolean isLecturerInCouncil = newCouncil.getCouncilLecturers().stream()
                                .anyMatch(cl -> cl.getLecturer().equals(instructor));
                        boolean isLecturerInCouncil2 = newCouncil.getCouncilLecturers().stream()
                                .anyMatch(cl -> cl.getLecturer().equals(thesis));
                        if (!isLecturerInCouncil) {
                            instructor.getCouncilLecturers().add(councilInstructor);
                            councilInstructor.setLecturer(instructor);
                            councilInstructor.setRole("Ủy viên");
                            councilInstructor.setCouncil(newCouncil);
                        }
                        if (!isLecturerInCouncil2) {
                           thesis.getCouncilLecturers().add(councilCounterArgument);
                           councilCounterArgument.setCouncil(newCouncil);
                           councilCounterArgument.setRole("Chủ tịch");
                           councilCounterArgument.setLecturer(thesis);
                        }
                        saveCouncil.add(newCouncil);
                        saveLecturer.add(instructor);
                        saveLecturer.add(thesis);
                        // thêm vào CouncilLecturer
                        councilLecturers.add(councilCounterArgument);
                        councilLecturers.add(councilInstructor);
                    }
                    Set<EvaluationCriteria> evaluationCriteria = evaluationCriteriaRepository.getEvaluationCriteriaByTypeSubject(typeSubject);
                    if (evaluationCriteria!=null){
                        newSubject.setCriteria(evaluationCriteria);
                    }
                    saveSub.add(newSubject);
                    System.out.println("Luu TLCN Thanh Cong");
                });
                subjectRepository.saveAll(saveSub);
                lecturerRepository.saveAll(saveLecturer);
                councilRepository.saveAll(saveCouncil);
                studentRepository.saveAll(saveStudent);
                councilLecturerRepository.saveAll(councilLecturers);
                return ResponseEntity.ok("Imported file to list subject successful!");
            } else
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File upload is not match format, please try again!");

    }


    public boolean checkExcelFormat(MultipartFile file){
        String contentType = file.getContentType();
        if (contentType == null) throw new AssertionError();
        return contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }
    public List<Subject> toSubjects(InputStream inputStream){
        List<Subject> subjects_TLCN = new ArrayList<>();
        try{
            XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
            XSSFSheet sheet = workbook.getSheet("TLCN");
            int rowNumber = 0;
            int rowCount = sheet.getPhysicalNumberOfRows();
            for (int i = 1; i < rowCount; i++) { // Bắt đầu từ hàng thứ 2 (hàng đầu tiên chứa tiêu đề)
                Row row = sheet.getRow(i);

                if (row != null) {
                    Subject subject = new Subject(); // Tạo một đối tượng Subject cho mỗi hàng

                    // Duyệt qua từng ô trong hàng và đọc dữ liệu
                    for (int j = 0; j < row.getLastCellNum(); j++) {
                        Cell cell = row.getCell(j);
                        switch (j) {
                            case 0 -> subject.setSubjectName(getCellValueAsString(cell));
                            case 1 -> {
                                subject.setStudent1(getCellValueAsString(cell));
                                Student student = studentRepository.findById(getCellValueAsString(cell)).orElse(null);
                                System.out.println("Student 1: "+ student);
                            }
                            case 2 -> {
                                subject.setStudent2(getCellValueAsString(cell));
                            }
                            case 3 -> {
                                subject.setStudent3(getCellValueAsString(cell));
                            }
                            case 4 ->{
                                Lecturer instructor = lecturerRepository.findById(getCellValueAsString(cell)).orElse(null);
                                System.out.println("ID instruc: " + getCellValueAsString(cell));
                                System.out.println("Instruc: " + instructor);
                                subject.setInstructorId(instructor);
                            }
                            case 5 ->{
                                System.out.println(getCellValueAsString(cell));
                                Lecturer thesis = lecturerRepository.findById(getCellValueAsString(cell)).orElse(null);
                                System.out.println("Thesis: " + thesis);
                                subject.setThesisAdvisorId(thesis);
                            }
                            default -> throw new IllegalStateException("Unsupported column index: " + j);
                        }
                    }
                    // Sau khi đọc dữ liệu từ một hàng, thêm đối tượng Subject vào danh sách
                    subjects_TLCN.add(subject);
                }
            }
        } catch (Exception e){
            throw new RuntimeException("Error when convert file csv!" + e.getMessage());
        }
        for (Subject subject : subjects_TLCN) {
            System.out.println("Name: " + subject.getSubjectName());
            System.out.println("Student 1: " + subject.getStudent1());
            System.out.println("Student 2: " + subject.getStudent2());
            System.out.println("Student 3: " + subject.getStudent3());
            System.out.println("TLCN Mã GVHD: " + subject.getInstructorId());
            System.out.println("TLCN Mã GVPB: " + subject.getThesisAdvisorId());
        }
        return subjects_TLCN;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null || cell.getCellType() == CellType.BLANK) {
            return null;
        } else if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue();
        } else if (cell.getCellType() == CellType.NUMERIC) {
            // Xử lý giá trị số nguyên thành chuỗi
            return String.valueOf((int) cell.getNumericCellValue());
        } else {
            throw new IllegalStateException("Unsupported cell type: " + cell.getCellType());
        }
    }
}