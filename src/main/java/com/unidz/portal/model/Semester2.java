package com.unidz.portal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "semester2")
@Getter @Setter
public class Semester2 {
    @Id private Integer id;
    private BigDecimal asd2;
    private BigDecimal ado;
    @Column(name = "avg_uef1") private BigDecimal avgUef1;
    @Column(name = "credit_uef1") private Integer creditUef1;
    private BigDecimal algebra2;
    private BigDecimal calculus2;
    private BigDecimal lm;
    @Column(name = "avg_uef2") private BigDecimal avgUef2;
    @Column(name = "credit_uef2") private Integer creditUef2;
    private BigDecimal pst1;
    @Column(name = "avg_uem") private BigDecimal avgUem;
    @Column(name = "credit_uem") private Integer creditUem;
    private BigDecimal oet;
    @Column(name = "avg_uet") private BigDecimal avgUet;
    @Column(name = "credit_uet") private Integer creditUet;
    @Column(name = "credit_sem") private Integer creditSem;
    @Column(name = "avg_sem") private BigDecimal avgSem;
    private Integer rank;
}
