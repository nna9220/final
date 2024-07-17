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
    @Autowired
    private ReviewByInstructorRepository reviewByInstructorRepository;
    @Autowired
    private ReviewByThesisRepository reviewByThesisRepository;

    public void exportWordFile(String outputPath, Major major, TypeSubject typeSubject) throws IOException {
        ClassLoader classLoader = getClass().getClassLoader();
        InputStream inputStream = classLoader.getResourceAsStream("template/Mau-2-Rubric-KLTN-Edit.docx");
        XWPFDocument document = new XWPFDocument(inputStream);
        LocalDate nowDate = LocalDate.now();

        // Lấy tiêu chí theo loại đề tài, năm và chuyên ngành
        List<EvaluationCriteria> criteriaList = evaluationCriteriaRepository.getEvaluationCriteriaByTypeSubjectAndMajorAndYear(typeSubject, major, String.valueOf(nowDate.getYear()));

        // Điền dữ liệu bộ môn
        appendTextAfterKeyword(document, "Bộ Môn :", String.valueOf(major));

        // Điền tiêu chí và thang điểm
        XWPFTable table = document.getTables().get(1); // Lấy bảng thứ hai
        // Xóa nội dung các ô trong cột STT, Tiêu chí và Điểm
        for (int i = 1; i < table.getNumberOfRows(); i++) {
            XWPFTableRow row = table.getRow(i);
            row.getCell(0).removeParagraph(0); // Ô STT
            row.getCell(1).removeParagraph(0); // Ô Tiêu chí
            row.getCell(2).removeParagraph(0); // Ô Điểm
        }

        // Điền lại tiêu chí và thang điểm
        for (int i = 0; i < criteriaList.size(); i++) {
            EvaluationCriteria criteria = criteriaList.get(i);
            XWPFTableRow row = (i < table.getNumberOfRows() - 1) ? table.getRow(i + 1) : table.createRow();
            row.getCell(0).setText(String.valueOf(i + 1));
            row.getCell(1).setText(criteria.getCriteriaName());
            row.getCell(2).setText(criteria.getCriteriaScore().toString());
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
            //Tìm kiếm đánh giá của gvhd theo đề tài
            ReviewByInstructor reviewByInstructor = reviewByInstructorRepository.getReviewByInstructorBySAndSubject(subject);
            if (reviewByInstructor==null) {
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
            }else {
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
                appendTextAfterKeyword(document,"1.\tVề nội dung đề tài & khối lượng thực hiện: ",reviewByInstructor.getReviewContent());
                appendTextAfterKeyword(document,"2.\tƯu điểm: ",reviewByInstructor.getReviewAdvantage());
                appendTextAfterKeyword(document,"3.\tKhuyết điểm: ",reviewByInstructor.getReviewWeakness());
                if (reviewByInstructor.getStatus()){
                    appendTextAfterKeyword(document,"4.\tĐề nghị cho bảo vệ hay không ?","Có");
                }else {
                    appendTextAfterKeyword(document,"4.\tĐề nghị cho bảo vệ hay không ?","Không");
                }
                appendTextAfterKeyword(document,"5.\tĐánh giá loại : ",reviewByInstructor.getClassification());
                appendTextAfterKeyword(document,"6.\tĐiểm : ", String.valueOf(reviewByInstructor.getScore()));
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
            //Tìm đánh giá của gvpb
            ReviewByThesis reviewByThesis = reviewByThesisRepository.getReviewByThesisBySAndSubject(subject);
            if (reviewByThesis==null) {
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
            }else {
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
                appendTextAfterKeyword(document,"1.\tVề nội dung đề tài & khối lượng thực hiện: ",reviewByThesis.getReviewContent());
                appendTextAfterKeyword(document,"2.\tƯu điểm: ",reviewByThesis.getReviewAdvantage());
                appendTextAfterKeyword(document,"3.\tKhuyết điểm: ",reviewByThesis.getReviewWeakness());
                if (reviewByThesis.getStatus()){
                    appendTextAfterKeyword(document,"4.\tĐề nghị cho bảo vệ hay không ?","Có");
                }else {
                    appendTextAfterKeyword(document,"4.\tĐề nghị cho bảo vệ hay không ?","Không");
                }
                appendTextAfterKeyword(document,"5.\tĐánh giá loại : ",reviewByThesis.getClassification());
                appendTextAfterKeyword(document,"6.\tĐiểm : ", String.valueOf(reviewByThesis.getScore()));
            }

            // Lưu file đã chỉnh sửa
            FileOutputStream fos = new FileOutputStream(outputPath);
            document.write(fos);
            fos.close();
            inputStream.close();
        }
    }

}
