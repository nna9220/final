package com.web.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "report_fifty")
@NoArgsConstructor
@AllArgsConstructor
public class CouncilReportTime implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private int id;

    @Column(name="report_time_start")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reportTimeStart;

    @Column(name="report_time_end")
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reportTimeEnd;

    //set thời gian mặc địnhbắt đầu và kết thúc
  /*  // Set custom times
        entity.setReportTimeStart(LocalDateTime.of(LocalDate.now(), LocalTime.of(7, 0, 0)));
        entity.setReportTimeEnd(LocalDateTime.of(LocalDate.now(), LocalTime.of(17, 0, 0)));
*/

    @Column(name="registration_name")
    private String reportName;

    @Column(name="status")
    private Boolean status;
}
