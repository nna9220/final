package com.web.controller;

import com.web.entity.Lecturer;
import com.web.entity.SchoolYear;
import com.web.mapper.LecturerMapper;
import com.web.mapper.SchoolYearMapper;
import com.web.repository.LecturerRepository;
import com.web.service.Admin.LecturerService;
import com.web.service.Admin.SchoolYearService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/team/profile")
public class ProfileLecturerController {

    @Autowired
    private LecturerService lecturerService;
    @Autowired
    private LecturerMapper lecturerMapper;
    @Autowired
    private LecturerRepository lecturerRepository;


    @GetMapping("/{lecturerId}")
    public ResponseEntity<?> getProfile(@PathVariable String lecturerId) {
        // Lấy thông tin lớp học cần chỉnh sửa từ service
        Lecturer lecturer = lecturerRepository.findById(lecturerId).orElse(null);

        // Kiểm tra xem lớp học có tồn tại không
        if (lecturer != null) {
            // Trả về ModelAndView với thông tin lớp học và đường dẫn của trang chỉnh sửa
            ModelAndView model = new ModelAndView("profile");
            model.addObject("lecturer", lecturer);
            return new ResponseEntity<>(lecturer, HttpStatus.OK);
        } else {
            // Trả về ModelAndView với thông báo lỗi nếu không tìm thấy lớp học
            return new ResponseEntity<>("Không tìm thấy giảng viên", HttpStatus.NOT_FOUND);
        }

    }
}
