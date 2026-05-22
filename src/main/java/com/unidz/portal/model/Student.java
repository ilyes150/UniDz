package com.unidz.portal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "student")
@Getter @Setter
public class Student {
    @Id
    private Integer id;
    private String fname;
    private String lname;
    @Column(name = "student_code")
    private String studentCode;
    private String field;
    private String major;
    private String specialty;
    private String cycle;
    private Integer level;
    @Column(name = "group_num")
    private Integer groupNum;
}