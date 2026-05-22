package com.unidz.portal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "semester1")
@Getter @Setter
public class Semester1 {
    @Id private Integer id;
    private BigDecimal asd1;
    private BigDecimal ios1;
    private BigDecimal sm;
    @Column(name = "avg_uef1") private BigDecimal avgUef1;
    @Column(name = "credit_uef1") private Integer creditUef1;
    private BigDecimal algebra1;
    private BigDecimal calculus1;
    @Column(name = "avg_uef2") private BigDecimal avgUef2;
    @Column(name = "credit_uef2") private Integer creditUef2;
    private BigDecimal electronic;
    @Column(name = "avg_ued") private BigDecimal avgUed;
    @Column(name = "credit_ued") private Integer creditUed;
    private BigDecimal te;
    @Column(name = "avg_uet") private BigDecimal avgUet;
    @Column(name = "credit_uet") private Integer creditUet;
    @Column(name = "credit_sem") private Integer creditSem;
    @Column(name = "avg_sem") private BigDecimal avgSem;
    private Integer rank;
}