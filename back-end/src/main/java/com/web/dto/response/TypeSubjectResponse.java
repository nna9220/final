package com.web.dto.response;

import com.web.entity.RegistrationPeriod;
import com.web.entity.Subject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TypeSubjectResponse implements Serializable {
    private int typeId;
    private String typeName;
    private List<Subject> subjectsList;
    private List<RegistrationPeriod> registrationPeriods;
}
