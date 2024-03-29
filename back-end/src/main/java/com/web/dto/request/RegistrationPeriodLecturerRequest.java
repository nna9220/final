package com.web.dto.request;

import com.web.entity.TypeSubject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.sql.Date;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class RegistrationPeriodLecturerRequest implements Serializable {
    private int periodId;

    private String registrationTimeStart;
    private String registrationTimeEnd;

    private String registrationName;
    private TypeSubject typeSubjectId;
}
