INSERT INTO result (id, avg_s1, avg_s2, avg_s3, avg_s4, avg, rank)
SELECT
    s1.ID,
    s1.Avg_Sem                                            AS avg_s1,
    s2.Avg_Sem                                            AS avg_s2,
    s3.Avg_Sem                                            AS avg_s3,
    NULL                                                  AS avg_s4,
    ROUND((s1.Avg_Sem + s2.Avg_Sem + s3.Avg_Sem) / 3, 2) AS avg,
    RANK() OVER (
        ORDER BY (s1.Avg_Sem + s2.Avg_Sem + s3.Avg_Sem) DESC
    )                                                     AS rank
FROM Semester1 s1
JOIN Semester2 s2 ON s1.id = s2.id
JOIN Semester3 s3 ON s1.id = s3.id;