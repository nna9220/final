package com.web.controller.admin.GraduationThesis;

import com.web.entity.TypeSubject;
import com.web.repository.TypeSubjectRepository;
import com.web.service.Admin.ImportStudentCheckRegister;
import com.web.service.Admin.TimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin/timeGraduation")
public class TimeGraduationController {

    @Autowired
    private TimeService timeService;
    @Autowired
    private ImportStudentCheckRegister importStudentCheckRegister;
    @Autowired
    private TypeSubjectRepository typeSubjectRepository;

    // Lấy danh sách Registration Period Lecturer theo TypeSubject
    @GetMapping("/registration-periods")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getListRegistrationLecturerPeriod() {
        TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
        return timeService.getListRegistrationLecturerPeriod(typeSubject);
    }

    // Lấy chi tiết tất cả thời gian liên quan đến RegistrationPeriodLecturer theo id
    @GetMapping("/details/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getDetailAllTimeByRegistrationPeriodLecturer(@PathVariable("id") int id) {
        return timeService.getDetailAllTimeByRegistrationPeriodLecturer(id);
    }

    // Tạo mới tất cả các thời gian liên quan đến RegistrationPeriodLecturer
    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createAllTime(
            @RequestParam("registrationTimeStart") String registrationTimeStart,
            @RequestParam("registrationTimeEnd") String registrationTimeEnd,
            @RequestParam("registrationName") String registrationName,

            @RequestParam("timeBrowsOfHeadStart") String timeBrowsOfHeadStart,
            @RequestParam("timeBrowsOfHeadEnd") String timeBrowsOfHeadEnd,

            @RequestParam("registrationPeriodStart") String registrationPeriodStart,
            @RequestParam("registrationPeriodEnd") String registrationPeriodEnd,
            @RequestParam("registrationPeriodName") String registrationPeriodName,

            @RequestParam("reportSubmissionTimeStart") String reportSubmissionTimeStart,
            @RequestParam("reportSubmissionTimeEnd") String reportSubmissionTimeEnd,
            @RequestParam("reportSubmissionTimeName") String reportSubmissionTimeName,

            @RequestParam("councilReportTimeStart") String councilReportTimeStart,
            @RequestParam("councilReportTimeEnd") String councilReportTimeEnd,
            @RequestParam("councilReportTimeName") String councilReportTimeName,
            //file excel
            @RequestParam("file") MultipartFile file) throws IOException {

        System.out.println("Data nhận Student: " + registrationName + " " + registrationTimeStart + " " + registrationTimeEnd);
        System.out.println("Data nhận Lecturer: " + registrationPeriodName + " " + registrationPeriodStart + " " + registrationPeriodEnd);
        System.out.println("Data nhận Report: " + reportSubmissionTimeName + " " + reportSubmissionTimeStart + " " + reportSubmissionTimeEnd);
        System.out.println("Data nhận Time browse: " + timeBrowsOfHeadStart + " " + timeBrowsOfHeadEnd );
        System.out.println("Data nhận Council: " + councilReportTimeName + " " + councilReportTimeStart + " " + councilReportTimeEnd);
        TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");
        return timeService.createAllTime(
                registrationPeriodStart, registrationPeriodEnd, registrationName, typeSubject,
                timeBrowsOfHeadStart, timeBrowsOfHeadEnd,
                registrationTimeStart, registrationTimeEnd,
                reportSubmissionTimeStart, reportSubmissionTimeEnd,
                councilReportTimeStart, councilReportTimeEnd,file
        );
    }

    // Sửa tất cả các thời gian liên quan đến RegistrationPeriodLecturer theo id
    @PostMapping("/edit/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> editAllTime(
            @PathVariable("id") int id,

            @RequestParam(value = "registrationTimeStart", required = false) String registrationTimeStart,
            @RequestParam(value = "registrationTimeEnd", required = false) String registrationTimeEnd,
            @RequestParam(value = "registrationName", required = false) String registrationName,

            @RequestParam(value = "timeBrowsOfHeadStart", required = false) String timeBrowsOfHeadStart,
            @RequestParam(value = "timeBrowsOfHeadEnd", required = false) String timeBrowsOfHeadEnd,

            @RequestParam(value = "registrationPeriodStart", required = false) String registrationPeriodStart,
            @RequestParam(value = "registrationPeriodEnd", required = false) String registrationPeriodEnd,
            @RequestParam(value = "registrationPeriodName", required = false) String registrationPeriodName,

            @RequestParam(value = "reportSubmissionTimeStart", required = false) String reportSubmissionTimeStart,
            @RequestParam(value = "reportSubmissionTimeEnd", required = false) String reportSubmissionTimeEnd,
            @RequestParam(value = "reportSubmissionTimeName", required = false) String reportSubmissionTimeName,

            @RequestParam(value = "councilReportTimeStart", required = false) String councilReportTimeStart,
            @RequestParam(value = "councilReportTimeEnd", required = false) String councilReportTimeEnd,
            @RequestParam(value = "councilReportTimeName", required = false) String councilReportTimeName,

            //file excel
            @RequestParam("file") MultipartFile file) throws IOException {
        TypeSubject typeSubject = typeSubjectRepository.findSubjectByName("Khóa luận tốt nghiệp");

        // Sửa các thời gian liên quan
        ResponseEntity<?> response = timeService.editAllTime(
                id,
                registrationTimeStart,
                registrationTimeEnd,
                registrationName,

                timeBrowsOfHeadStart,
                timeBrowsOfHeadEnd,

                registrationPeriodStart,
                registrationPeriodEnd,
                registrationPeriodName,

                reportSubmissionTimeStart,
                reportSubmissionTimeEnd,
                reportSubmissionTimeName,

                councilReportTimeStart,
                councilReportTimeEnd,
                councilReportTimeName,
                file,
                typeSubject
        );

        // Xử lý file Excel nếu có
        if (file != null && !file.isEmpty()) {
            importStudentCheckRegister.importStudent(file);
        }

        return response;
    }
}
