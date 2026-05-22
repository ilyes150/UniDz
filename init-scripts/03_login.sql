INSERT INTO login (id, username, password)
SELECT 
    id, 
    student_code AS username,
    encode(sha256(concat('science', substring(student_code from 5))::bytea), 'hex') AS password
FROM student;