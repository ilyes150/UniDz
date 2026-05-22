package com.unidz.portal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "result")
@Getter @Setter
public class Result {
    @Id
    private Integer id;
    @Column(name = "avg_s1") private BigDecimal avgS1;
    @Column(name = "avg_s2") private BigDecimal avgS2;
    @Column(name = "avg_s3") private BigDecimal avgS3;
    @Column(name = "avg_s4") private BigDecimal avgS4;
    private BigDecimal avg;
    private Integer rank;
}