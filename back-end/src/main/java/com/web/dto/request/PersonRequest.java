package com.web.dto.request;

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
public class PersonRequest implements Serializable {
    private String personId;
    private String lastName;
    private String firstName;
    private String email;
    private String image;
    private String phone;
    private String user_name;
    private Authority authority_name;
    private boolean gender;
    private Roles role;

    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date birthDay;

    private String password;
    private boolean status;

    private List<Comment> comments;
}
