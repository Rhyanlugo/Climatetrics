/* show co2 emissions, gdp, and global temperatures over time and compare countries */
VARIABLE p_country1 VARCHAR2(60);
VARIABLE p_country2 VARCHAR2(60);

EXEC :p_country1 := 'Argentina'; /* placeholder, should be changed to whatever user selects */
EXEC :p_country2 := 'Mexico'; /* placeholder, should be changed to whatever user selects */

/* drop down menu should contain the following values for both country fields */
SELECT DISTINCT country FROM ANNUALSURFACETEMPCHANGENORMALIZED
ORDER BY country;

/* complex trend query */
SELECT 
    t1.year, 
    MAX(t1.country) AS country1,
    MAX(t1.tempchange) AS tempchange1, 
    MAX(t1.gdp) AS gdp1, 
    MAX(t1.co2) AS co2_1, 
    MAX(t2.country) AS country2,
    MAX(t2.tempchange) AS tempchange2, 
    MAX(t2.gdp) AS gdp2, 
    MAX(t2.co2) AS co2_2
FROM
    (
        SELECT 
            a.country, 
            a.year, 
            a.tempchange, 
            c.value AS gdp, 
            e.value AS co2
        FROM 
            ANNUALSURFACETEMPCHANGENORMALIZED a
        JOIN 
            COUNTRYGDP c ON a.country_id = c.country_id AND a.year = c.year
        JOIN 
            CO2EMISSIONS e ON c.country_id = e.country_id AND c.year = e.year
        WHERE 
            c.countryname = :p_country1
    ) t1
FULL JOIN 
    (
        SELECT 
            a.country, 
            a.year, 
            a.tempchange, 
            c.value AS gdp, 
            e.value AS co2
        FROM 
            ANNUALSURFACETEMPCHANGENORMALIZED a
        JOIN 
            COUNTRYGDP c ON a.country_id = c.country_id AND a.year = c.year
        JOIN 
            CO2EMISSIONS e ON c.country_id = e.country_id AND c.year = e.year
        WHERE 
            c.countryname = :p_country2
    ) t2
ON 
    t1.year = t2.year
WHERE 
    t1.year IS NOT NULL AND t2.year IS NOT NULL
GROUP BY 
    t1.year
ORDER BY 
    t1.year;
