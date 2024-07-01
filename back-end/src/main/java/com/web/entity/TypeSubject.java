package com.web.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "type_subject")
@NoArgsConstructor
@AllArgsConstructor
public class TypeSubject implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="type_id")
    private int typeId;

    @Column(name="type_name", unique = true)
    private String typeName;

    @OneToMany(mappedBy = "typeSubject", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Subject> subjectsList;

    @OneToMany(mappedBy = "typeSubjectId",orphanRemoval = true)
    @JsonIgnore
    private List<RegistrationPeriod> registrationPeriods;

    @OneToMany(mappedBy = "typeSubject",orphanRemoval = true)
    @JsonIgnore
    private List<EvaluationCriteria> evaluationCriteria;

    @OneToMany(mappedBy = "typeSubjectId",orphanRemoval = true)
    @JsonIgnore
    private List<RegistrationPeriodLectuer> registrationLecturerPeriods;

    @OneToMany(mappedBy = "typeSubjectId",orphanRemoval = true)
    @JsonIgnore
    private List<CouncilReportTime> councilReportTimes;

    @OneToMany(mappedBy = "typeSubjectId",orphanRemoval = true)
    @JsonIgnore
    private List<ReportSubmissionTime> reportSubmissionTimes;

    @OneToMany(mappedBy = "typeSubjectId",orphanRemoval = true)
    @JsonIgnore
    private List<TimeBrowsOfHead> timeBrowsOfHeads;

}
