package com.unidz.portal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "semester3")
@Getter @Setter
public class Semester3 {
    @Id private Integer id;
    private BigDecimal asd3;
    private BigDecimal isi;
    private BigDecimal oop1;
    @Column(name = "avg_uef1") private BigDecimal avgUef1;
    @Column(name = "credit_uef1") private Integer creditUef1;
    private BigDecimal algebre3;
    private BigDecimal calculus3;
    @Column(name = "avg_uef2") private BigDecimal avgUef2;
    @Column(name = "credit_uef2") private Integer creditUef2;
    private BigDecimal pst2;
    @Column(name = "avg_uem") private BigDecimal avgUem;
    @Column(name = "credit_uem") private Integer creditUem;
    private BigDecimal entreprenariat;
    @Column(name = "avg_uet") private BigDecimal avgUet;
    @Column(name = "credit_uet") private Integer creditUet;
    @Column(name = "credit_sem") private Integer creditSem;
    @Column(name = "avg_sem") private BigDecimal avgSem;
    private Integer rank;
}