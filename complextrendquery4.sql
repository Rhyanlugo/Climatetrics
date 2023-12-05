/* see total weather severity, number of flights delayed, and time of delays per month of a year for a given airport */
VARIABLE p_airport VARCHAR2(10);
EXEC :p_airport := 'ORD'; /* placeholder, should be changed to whatever user selects */

/* drop down menu should contain the following values */
SELECT DISTINCT airport FROM USWEATHEREVENTS
ORDER BY airport;


SELECT EXTRACT(YEAR FROM starttimeutc) AS year, EXTRACT(MONTH FROM starttimeutc) AS month, e.AIRPORT, SUM(s.RANKING) AS weather_severity, SUM(weather_ct) AS n_of_delays, 
SUM(weather_delay) AS time_delays
FROM USWEATHEREVENTS e
JOIN USWEATHEREVENTSSCALE s ON e.severity = s.severity
RIGHT JOIN FLIGHTDELAYS f ON f.airport = e.airport AND EXTRACT(YEAR FROM starttimeutc) = f.year AND EXTRACT(MONTH FROM starttimeutc) = f.month
WHERE e.airport = :p_airport
GROUP BY EXTRACT(YEAR FROM starttimeutc), EXTRACT(MONTH FROM starttimeutc), e.AIRPORT
ORDER BY EXTRACT(YEAR FROM starttimeutc), EXTRACT(MONTH FROM starttimeutc);
/* complex trend query */

