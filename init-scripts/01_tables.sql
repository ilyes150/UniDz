CREATE TABLE student (
    id INT PRIMARY KEY,
    fname VARCHAR(100),
    lname VARCHAR(100),
    student_code VARCHAR(50),
    field VARCHAR(255),
    major VARCHAR(255),
    specialty VARCHAR(255) NULL,
    cycle VARCHAR(100),
    level INT,
    group_num INT
);

CREATE TABLE login (
    id          INT PRIMARY KEY,
    username    VARCHAR(20),
    password    VARCHAR(256),
    FOREIGN KEY (id) REFERENCES Student(id)
);

CREATE TABLE semester1 (
    ID          INT PRIMARY KEY,
    ASD1        DECIMAL(5,2),
    IOS1        DECIMAL(5,2),
    SM          DECIMAL(5,2),
    Avg_UEF1    DECIMAL(5,2),
    Credit_UEF1 INT,
    Algebra1    DECIMAL(5,2),
    Calculus1   DECIMAL(5,2),
    Avg_UEF2    DECIMAL(5,2),
    Credit_UEF2 INT,
    Electronic  DECIMAL(5,2),
    Avg_UED     DECIMAL(5,2),
    Credit_UED  INT,
    TE          DECIMAL(5,2),
    Avg_UET     DECIMAL(5,2),
    Credit_UET  INT,
    Credit_Sem  INT,
    Avg_Sem     DECIMAL(5,2),
    rank        INT,
    FOREIGN KEY (ID) REFERENCES Student(id)
);

CREATE TABLE semester2 (
    ID          INT PRIMARY KEY,
    ASD2        DECIMAL(5,2),
    ADO         DECIMAL(5,2),
    Avg_UEF1    DECIMAL(5,2),
    Credit_UEF1 INT,
    Algebra2    DECIMAL(5,2),
    Calculus2   DECIMAL(5,2),
    LM          DECIMAL(5,2),
    Avg_UEF2    DECIMAL(5,2),
    Credit_UEF2 INT,
    PST1        DECIMAL(5,2),
    Avg_UEM     DECIMAL(5,2),
    Credit_UEM  INT,
    OET         DECIMAL(5,2),
    Avg_UET     DECIMAL(5,2),
    Credit_UET  INT,
    Credit_Sem  INT,
    Avg_Sem     DECIMAL(5,2),
    rank        INT,
    FOREIGN KEY (ID) REFERENCES Student(id)
);

CREATE TABLE semester3 (
    ID          INT PRIMARY KEY,
    ASD3        DECIMAL(5,2),
    ISI         DECIMAL(5,2),
    OOP1        DECIMAL(5,2),
    Avg_UEF1    DECIMAL(5,2),
    Credit_UEF1 INT,
    Algebre3    DECIMAL(5,2),
    Calculus3   DECIMAL(5,2),
    Avg_UEF2    DECIMAL(5,2),
    Credit_UEF2 INT,
    PST2        DECIMAL(5,2),
    Avg_UEM     DECIMAL(5,2),
    Credit_UEM  INT,
    Entreprenariat DECIMAL(5,2),
    Avg_UET     DECIMAL(5,2),
    Credit_UET  INT,
    Credit_Sem  INT,
    Avg_Sem     DECIMAL(5,2),
    rank        INT,
    FOREIGN KEY (ID) REFERENCES Student(id)
);

CREATE TABLE semester4 (
    ID          INT PRIMARY KEY,
    OOP2        DECIMAL(5,2),
    IOS2        DECIMAL(5,2),
    Avg_UEF1    DECIMAL(5,2),
    Credit_UEF1 INT,
    INET        DECIMAL(5,2),
    IDB         DECIMAL(5,2),
    LT          DECIMAL(5,2),
    Avg_UEF2    DECIMAL(5,2),
    Credit_UEF2 INT,
    GT          DECIMAL(5,2),
    Avg_UEM     DECIMAL(5,2),
    Credit_UEM  INT,
    Ethics      DECIMAL(5,2),
    Avg_UET     DECIMAL(5,2),
    Credit_UET  INT,
    Credit_Sem  INT,
    Avg_Sem     DECIMAL(5,2),
    rank        INT,
    FOREIGN KEY (ID) REFERENCES Student(id)
);

CREATE TABLE result (
    id          INT PRIMARY KEY,
    avg_s1      DECIMAL(5,2),
    avg_s2      DECIMAL(5,2),
    avg_s3      DECIMAL(5,2),
    avg_s4      DECIMAL(5,2),
    avg         DECIMAL(5,2),
    rank        INT,
    FOREIGN KEY (id) REFERENCES student(id)
);