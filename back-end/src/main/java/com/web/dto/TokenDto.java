package com.web.dto;

import com.web.entity.Person;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenDto {

    private String token;

    private Person user;
}
