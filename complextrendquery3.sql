/* show co2 emissions, gdp, and global temperatures over time and compare countries */
VARIABLE p_country1 VARCHAR2(60);
VARIABLE p_country2 VARCHAR2(60);

EXEC :p_country1 := 'Argentina'; /* placeholder, should be changed to whatever user selects */
EXEC :p_country2 := 'Mexico'; /* placeholder, should be changed to whatever user selects */

/* drop down menu should contain the following values for both country fields */
SELECT DISTINCT country FROM ANNUALSURFACETEMPCHANGENORMALIZED
ORDER BY country;

/* complex trend query */
SELECT t1.year, t1.country, t1.tempchange, t1.gdp, t1.co2, t2.country, t2.tempchange, t2.gdp, t2.co2
FROM
(SELECT a.country, a.year, a.tempchange, c.value AS gdp, e.value AS co2
FROM ANNUALSURFACETEMPCHANGENORMALIZED a
JOIN COUNTRYGDP c ON a.country_id = c.country_id AND a.year = c.year
JOIN CO2EMISSIONS e ON c.country_id = e.country_id AND c.year = e.year
WHERE c.countryname = :p_country1) t1
FULL JOIN (
SELECT a.country, a.year, a.tempchange, c.value AS gdp, e.value AS co2
FROM ANNUALSURFACETEMPCHANGENORMALIZED a
JOIN COUNTRYGDP c ON a.country_id = c.country_id AND a.year = c.year
JOIN CO2EMISSIONS e ON c.country_id = e.country_id AND c.year = e.year
WHERE c.countryname = :p_country2) t2
ON t1.year = t2.year
ORDER BY year;
