/* getting the ratio of emission for a particular industry per year for a given continent */
VARIABLE p_continent VARCHAR2(50);
VARIABLE p_industry VARCHAR2(50);

EXEC :p_continent := 'Asia'; /* placeholder, should be changed based on what user selects */
EXEC :p_industry := 'Construction'; /* placeholder, should be changed based on what user selects */

/* drop down menu should contain the following values */
SELECT DISTINCT continent FROM WORLDPOPULATION
ORDER BY continent;

/* complex trend query */
SELECT c2.year, w.continent, SUM(c2.emission) / SUM(total_emission.total) AS ratio
FROM CO2INDUSTRIESNORMALIZED c2
JOIN WORLDPOPULATION w ON c2.country_id = w.country_id
JOIN (
    SELECT
        c.year,
        c.country,
        SUM(c.emission) AS total
    FROM
        CO2INDUSTRIESNORMALIZED c
    GROUP BY
        c.year, c.country
) total_emission ON c2.year = total_emission.year AND c2.country = total_emission.country
WHERE w.continent = :p_continent AND c2.industry = :p_industry
GROUP BY c2.year, w.continent
ORDER BY c2.year;
