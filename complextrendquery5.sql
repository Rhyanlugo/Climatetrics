/* see total weather severity, number of flights delayed, and time of delays per month of a year for a given region */
VARIABLE p_region VARCHAR2(30);
EXEC :p_region := 'Northeastern states'; /* placeholder, should be changed to whatever user selects */

/* drop down menu should contain the following values */
SELECT DISTINCT region FROM ZIPCODEINDEX
ORDER BY region;

/* complex trend query */
SELECT EXTRACT(YEAR FROM starttimeutc) AS year, EXTRACT(MONTH FROM starttimeutc) AS month, z.region, SUM(s.RANKING) AS weather_severity, SUM(weather_ct) AS n_of_delays, SUM(weather_delay) AS time_delays
FROM USWEATHEREVENTS e
JOIN USWEATHEREVENTSSCALE s ON e.severity = s.severity
RIGHT JOIN FLIGHTDELAYS f ON f.airport = e.airport AND EXTRACT(YEAR FROM starttimeutc) = f.year AND EXTRACT(MONTH FROM starttimeutc) = f.month
JOIN ZIPCODEINDEX z ON SUBSTR(e.zipcode, 1, 1) = z.firstdigit
WHERE z.region = :p_region
GROUP BY EXTRACT(YEAR FROM starttimeutc), EXTRACT(MONTH FROM starttimeutc), z.region
ORDER BY EXTRACT(YEAR FROM starttimeutc), EXTRACT(MONTH FROM starttimeutc);
