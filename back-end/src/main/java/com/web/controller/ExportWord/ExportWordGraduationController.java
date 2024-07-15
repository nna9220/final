package com.web.controller.ExportWord;

import com.web.config.CheckRole;
import com.web.config.TokenUtils;
import com.web.entity.Lecturer;
import com.web.entity.Person;
import com.web.entity.TypeSubject;
import com.web.repository.LecturerRepository;
import com.web.repository.PersonRepository;
import com.web.repository.TypeSubjectRepository;
import com.web.service.HeaderOdDepartment.WordExportService;
import com.web.utils.UserUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@RestController
@CrossOrigin
@RequestMapping("/api/graduation/export")
@RequiredArgsConstructor
public class ExportWordGraduationController {
    @Autowired
    private WordExportService wordExportService;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private TokenUtils tokenUtils;
    @Autowired
    private UserUtils userUtils;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;
    @Autowired
    private LecturerRepository lecturerRepository;
    //EXPOET TIÊU CHÍ CHẤM ĐIỂM -CHO CẢ GVHD VÀ GVPB - NẰM Ở SIDERBAR HỘI ĐỒNG BÁO CÁO
    @GetMapping("/criteria")
    public ResponseEntity<?> exportWord(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("outputPath") String outputPath) {
        try {
            TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
            String token = tokenUtils.extractToken(authorizationHeader);
            Person personCurrent = CheckRole.getRoleCurrent2(token, userUtils, personRepository);
            Lecturer currentLecturer = lecturerRepository.findById(personCurrent.getPersonId()).orElse(null);
            if (currentLecturer != null) {
                wordExportService.exportWordFile(outputPath, currentLecturer.getMajor(), typeSubject);
                return ResponseEntity.ok("File exported successfully to " + outputPath);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error exporting file: " + e.getMessage());
        }
    }

    @GetMapping("/reviewInstructor/{subjectId}")
    public ResponseEntity<InputStreamResource> exportReviewInstructor(
            @PathVariable int subjectId,
            @RequestParam("outputPath") String outputPath) throws IOException {
        wordExportService.exportReviewByInstructorFile(outputPath, subjectId);

        File file = new File(outputPath);
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + file.getName())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(file.length())
                .body(resource);
    }

    @GetMapping("/reviewThesis/{subjectId}")
    public ResponseEntity<InputStreamResource> exportReviewThesis(
            @PathVariable int subjectId,
            @RequestParam("outputPath") String outputPath) throws IOException {
        wordExportService.exportReviewByThesisFile(outputPath, subjectId);

        File file = new File(outputPath);
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + file.getName())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(file.length())
                .body(resource);
    }

}
