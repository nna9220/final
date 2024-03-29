package com.web.dto.request;

import com.web.entity.Authority;
import com.web.entity.Person;
import com.web.entity.Subject;
import com.web.entity.Task;
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
public class LecturerRequest implements Serializable {
    private String lecturerId;
    private Authority authority;
    private String major;
    private Person person;
    private List<Subject> listSubInstruct;
    private List<Subject> listSubCounterArgument;
    private List<Task> tasks;
}
