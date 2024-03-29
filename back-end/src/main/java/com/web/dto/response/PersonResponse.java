package com.web.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.web.entity.Authority;
import com.web.entity.Comment;
import com.web.entity.Roles;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PersonResponse implements Serializable {
    private String personId;
    private String lastName;
    private String image;
    private String firstName;
    private String userName;
    private String phone;
    private boolean gender;
    private Authority authority;

    private String user_name;

    private Authority authority_name;
    @DateTimeFormat(pattern = "yyyy/MM/dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date birthDay;

    private boolean status;

    private List<Comment> comments;

}
