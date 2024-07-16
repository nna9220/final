package com.web.service.HeaderOdDepartment;

import com.web.entity.*;
import com.web.repository.*;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class WordExportService {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private EvaluationCriteriaRepository evaluationCriteriaRepository;
    @Autowired
    private ResultGraduationRepository resultGraduationRepository;
    @Autowired
    private ScoreGraduationRepository scoreGraduationRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    @Autowired
    private StudentRepository studentRepository;

    public void exportWordFile(String outputPath, Major major, TypeSubject typeSubject) throws IOException {
        ClassLoader classLoader = getClass().getClassLoader();
        InputStream inputStream = classLoader.getResourceAsStream("template/Mau-2-Rubric-KLTN-Edit.docx");
        XWPFDocument document = new XWPFDocument(inputStream);
        LocalDate nowDate = LocalDate.now();

        // Lấy tiêu chí theo loại đề tài, năm và chuyên ngành
        List<EvaluationCriteria> criteriaList = evaluationCriteriaRepository.getEvaluationCriteriaByTypeSubjectAndMajorAndYear(typeSubject, major, String.valueOf(nowDate.getYear()));

        // Điền dữ liệu bộ môn
        appendTextAfterKeyword(document, "Bộ Môn :", String.valueOf(major));

        // Tìm bảng tiêu chí
        XWPFTable criteriaTable = null;
        for (XWPFTable table : document.getTables()) {
            XWPFTableRow headerRow = table.getRow(0);
            if (headerRow != null && headerRow.getCell(1) != null && headerRow.getCell(1).getText().equals("Tiêu chí")) {
                criteriaTable = table;
                break;
            }
        }

        // Điền tiêu chí và thang điểm vào bảng tiêu chí
        if (criteriaTable != null) {
            // Xóa các hàng cũ trong bảng tiêu chí, trừ hàng tiêu đề
            int numberOfRows = criteriaTable.getNumberOfRows();
            for (int i = numberOfRows - 1; i > 0; i--) {
                criteriaTable.removeRow(i);
            }

            // Thêm các tiêu chí mới
            for (int i = 0; i < criteriaList.size(); i++) {
                EvaluationCriteria criteria = criteriaList.get(i);
                XWPFTableRow row = criteriaTable.createRow();
                row.getCell(0).setText(String.valueOf(i + 1));
                row.getCell(1).setText(criteria.getCriteriaName());
                row.getCell(2).setText(criteria.getCriteriaScore().toString());
            }
        }

        // Lưu file đã chỉnh sửa
        FileOutputStream fos = new FileOutputStream(outputPath);
        document.write(fos);
        fos.close();
        inputStream.close();
    }

    public void exportReviewByInstructorFile(String outputPath, int subjectId) throws IOException {
        ClassLoader classLoader = getClass().getClassLoader();
        InputStream inputStream = classLoader.getResourceAsStream("template/NhanXetGVHD.docx");

        XWPFDocument document = new XWPFDocument(inputStream);

        // Lấy dữ liệu từ cơ sở dữ liệu
        Subject subject = subjectRepository.findById(subjectId).orElse(null);
        if (subject != null) {
            // Tìm kết quả theo đề tài
            if (subject.getStudent1() != null) {
                Student student1 = studentRepository.findById(subject.getStudent1()).orElse(null);
                if (student1 != null) {
                    appendTextAfterKeyword(document, "Họ và tên Sinh viên 1 :", student1.getPerson().getFirstName() + " " + student1.getPerson().getLastName());
                    appendTextAfterKeyword(document, "MSSV 1:", student1.getStudentId());
                }
            }
            if (subject.getStudent2() != null) {
                Student student2 = studentRepository.findById(subject.getStudent2()).orElse(null);
                if (student2 != null) {
                    appendTextAfterKeyword(document, "Họ và tên Sinh viên 2 :", student2.getPerson().getFirstName() + " " + student2.getPerson().getLastName());
                    appendTextAfterKeyword(document, "MSSV 2:", student2.getStudentId());
                }
            }
            if (subject.getStudent3() != null) {
                Student student3 = studentRepository.findById(subject.getStudent3()).orElse(null);
                if (student3 != null) {
                    appendTextAfterKeyword(document, "Họ và tên Sinh viên 3 :", student3.getPerson().getFirstName() + " " + student3.getPerson().getLastName());
                    appendTextAfterKeyword(document, "MSSV 3:", student3.getStudentId());
                }
            }

            // Thay thế dữ liệu trong file mẫu
            appendTextAfterKeyword(document, "Tên đề tài:", subject.getSubjectName());

            if (subject.getInstructorId() != null) {
                Lecturer lecturer = subject.getInstructorId();
                appendTextAfterKeyword(document, "Họ và tên Giáo viên hướng dẫn:", lecturer.getPerson().getFirstName() + " " + lecturer.getPerson().getLastName());
            }

            // Lưu file đã chỉnh sửa
            FileOutputStream fos = new FileOutputStream(outputPath);
            document.write(fos);
            fos.close();
            inputStream.close();
        }
    }

    private void appendTextAfterKeyword(XWPFDocument document, String keyword, String textToAdd) {
        for (XWPFParagraph paragraph : document.getParagraphs()) {
            for (XWPFRun run : paragraph.getRuns()) {
                String text = run.getText(0);
                if (text != null && text.contains(keyword)) {
                    int pos = text.indexOf(keyword) + keyword.length();
                    String newText = text.substring(0, pos) + " " + textToAdd + text.substring(pos);
                    run.setText(newText, 0);
                    return; // Đã tìm thấy và thêm văn bản, không cần tiếp tục
                }
            }
        }
    }

    public void exportReviewByThesisFile(String outputPath, int subjectId) throws IOException {
        ClassLoader classLoader = getClass().getClassLoader();
        InputStream inputStream = classLoader.getResourceAsStream("template/NhanXetGVPB.docx");

        XWPFDocument document = new XWPFDocument(inputStream);

        // Lấy dữ liệu từ cơ sở dữ liệu
        Subject subject = subjectRepository.findById(subjectId).orElse(null);
        if (subject != null) {
            // Tìm kết quả theo đề tài
            if (subject.getStudent1() != null) {
                Student student1 = studentRepository.findById(subject.getStudent1()).orElse(null);
                if (student1 != null) {
                    appendTextAfterKeyword(document, "Họ và tên Sinh viên 1 :", student1.getPerson().getFirstName() + " " + student1.getPerson().getLastName());
                    appendTextAfterKeyword(document, "MSSV 1:", student1.getStudentId());
                }
            }
            if (subject.getStudent2() != null) {
                Student student2 = studentRepository.findById(subject.getStudent2()).orElse(null);
                if (student2 != null) {
                    appendTextAfterKeyword(document, "Họ và tên Sinh viên 2 :", student2.getPerson().getFirstName() + " " + student2.getPerson().getLastName());
                    appendTextAfterKeyword(document, "MSSV 2:", student2.getStudentId());
                }
            }
            if (subject.getStudent3() != null) {
                Student student3 = studentRepository.findById(subject.getStudent3()).orElse(null);
                if (student3 != null) {
                    appendTextAfterKeyword(document, "Họ và tên Sinh viên 3 :", student3.getPerson().getFirstName() + " " + student3.getPerson().getLastName());
                    appendTextAfterKeyword(document, "MSSV 3:", student3.getStudentId());
                }
            }

            // Thay thế dữ liệu trong file mẫu
            appendTextAfterKeyword(document, "Tên đề tài:", subject.getSubjectName());

            if (subject.getThesisAdvisorId() != null) {
                Lecturer lecturer = subject.getThesisAdvisorId();
                appendTextAfterKeyword(document, "Họ và tên Giáo viên phản biện:", lecturer.getPerson().getFirstName() + " " + lecturer.getPerson().getLastName());
            }

            // Lưu file đã chỉnh sửa
            FileOutputStream fos = new FileOutputStream(outputPath);
            document.write(fos);
            fos.close();
            inputStream.close();
        }
    }

}
