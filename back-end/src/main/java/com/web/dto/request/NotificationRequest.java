package com.web.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequest implements Serializable {
    private int notificationId;
    private String content;
    private String title;

    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date dateSubmit;
}
