/* determine percentage of industry within a specific country over time, and compare with another country (same industry) */
VARIABLE p_industry VARCHAR2(50);
VARIABLE p_country1 VARCHAR2(60);
VARIABLE p_country2 VARCHAR2(60);

EXEC :p_industry := 'Construction'; /* placeholder, should be changed to what user selects */
EXEC :p_country1 := 'Argentina'; /* placeholder, should be changed to what user selects */
EXEC :p_country2 := 'Mexico'; /* placeholder, should be changed to what user selects */

/* drop down menus should contain the following values for country and industry fields */
SELECT DISTINCT country FROM CO2INDUSTRIESNORMALIZED
ORDER BY country;

SELECT DISTINCT industry FROM CO2INDUSTRIESNORMALIZED
ORDER BY industry;

/* complex trend query */
SELECT t1.industry, t1.year, country1, percentage1, country2, percentage2
FROM (
    SELECT c2.year, c2.country AS country1, c2.industry, emission / (SELECT SUM(emission)
    FROM CO2INDUSTRIESNORMALIZED c
    WHERE c.year = c2.year AND c.country = c2.country) AS percentage1
    FROM CO2INDUSTRIESNORMALIZED c2
    WHERE c2.country = :p_country1 AND c2.industry = :p_industry) t1
    FULL JOIN (
    SELECT c4.year, c4.country AS country2, c4.industry, emission / (SELECT SUM(emission)
    FROM CO2INDUSTRIESNORMALIZED c3
    WHERE c3.year = c4.year AND c3.country = c4.country) AS percentage2
    FROM CO2INDUSTRIESNORMALIZED c4
    WHERE c4.country = :p_country2 AND c4.industry = :p_industry) t2
ON t1.year = t2.year AND t1.industry = t2.industry
ORDER BY year;
