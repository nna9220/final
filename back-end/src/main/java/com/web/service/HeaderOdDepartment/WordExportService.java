package com.web.service.HeaderOdDepartment;

import com.web.entity.*;
import com.web.repository.*;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
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

    public byte[] exportWordFile(Major major, TypeSubject typeSubject) throws IOException {
        ClassLoader classLoader = getClass().getClassLoader();
        InputStream inputStream = classLoader.getResourceAsStream("template/Mau-2-Rubric-KLTN-Edit.docx");
        XWPFDocument document = new XWPFDocument(inputStream);
        LocalDate nowDate = LocalDate.now();

        // Lấy tiêu chí theo loại đề tài, năm và chuyên ngành
        List<EvaluationCriteria> criteriaList = evaluationCriteriaRepository.getEvaluationCriteriaByTypeSubjectAndMajorAndYear(typeSubject, major, String.valueOf(nowDate.getYear()));

        // Điền dữ liệu bộ môn
        replaceTextInDocument(document, "Bộ Môn :", String.valueOf(major));

        // Điền tiêu chí và thang điểm
        XWPFTable table = document.getTables().get(1);
        for (int i = 0; i < criteriaList.size(); i++) {
            EvaluationCriteria criteria = criteriaList.get(i);
            XWPFTableRow row = table.createRow();
            row.getCell(0).setText(String.valueOf(i + 1));
            row.getCell(1).setText(criteria.getCriteriaName());
            row.getCell(2).setText(criteria.getCriteriaScore().toString());
        }

        // Lưu tài liệu vào ByteArrayOutputStream
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        document.write(byteArrayOutputStream);
        byteArrayOutputStream.close();
        inputStream.close();

        // Trả về nội dung của tài liệu dưới dạng byte array
        return byteArrayOutputStream.toByteArray();
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



    private void replaceTextInDocument(XWPFDocument document, String findText, String replaceText) {
        for (XWPFParagraph p : document.getParagraphs()) {
            for (XWPFRun r : p.getRuns()) {
                String text = r.getText(0);
                if (text != null && text.contains(findText)) {
                    text = text.replace(findText, replaceText);
                    r.setText(text, 0);
                }
            }
        }
    }
}
