import { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import { AirportWeatherSeverityLineChart } from '../../components/graphs/AirportWeatherSeverityLineChart';
import SelectedRegion from '../../components/SelectedRegion';
import SidePanel from '../../components/SidePanel';
import styles from './AcrossAirportByRegion.module.css';

export default function AcrossAirportByRegion() {
  const [regions, setRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [region, setRegion] = useState('Northeastern states');

  const [years, setYears] = useState([]);
  const [yearsMonth, setYearsMonth] = useState([]);
  const [weatherSeverity, setWeatherSeverity] = useState([]);
  const [delays, setDelays] = useState([]);
  const [timeDelays, setTimeDelays] = useState([]);

  const [airportWeatherSeverityByRegion, setAirportWeatherSeverityByRegion] =
    useState([]);

  const [
    yearHighLowFirstCountryWeatherSeverity,
    setYearHighLowFirstCountryWeatherSeverity,
  ] = useState({});

  const [yearHighLowFirstCountryDelays, setYearHighLowFirstCountryDelays] =
    useState({});

  const [
    yearHighLowFirstCountryTimeDelays,
    setYearHighLowFirstCountryTimeDelays,
  ] = useState({});

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(
          `http://localhost:7000/menuDisplay/regionsAirportsByWeatherEvents`,
        );

        const data = await res.json();

        setRegions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    const fetchAirportWeatherSeverityByRegion = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(
          `http://localhost:7000/airportWeatherSeverityByRegion?region=${region}`,
        );

        const data = await res.json();

        setAirportWeatherSeverityByRegion(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAirportWeatherSeverityByRegion();
  }, [region]);

  useEffect(() => {
    const update = () => {
      try {
        setIsLoading(true);
        let newYears = [];
        let newYearsMonth = [];
        let newWeatherSeverity = [];
        let newDelays = [];
        let newTimeDelays = [];

        if (
          years.length > 0 ||
          yearsMonth.length > 0 ||
          weatherSeverity.length > 0 ||
          delays.length > 0 ||
          timeDelays.length > 0
        ) {
          setYearsMonth([]);
          setWeatherSeverity([]);
          setDelays([]);
          setTimeDelays([]);
        }

        airportWeatherSeverityByRegion.map((el) => {
          let month = '';

          if (el.month.toString().length === 1) {
            month = `0${el.month.toString()}`;
          } else {
            month = el.month;
          }

          years.push(el.year);
          newYearsMonth.push(`${month}-${el.year}`);
          newWeatherSeverity.push(el.weatherSeverity);
          newDelays.push(el.delays);
          newTimeDelays.push(el.timeDelays / 3600);
        });

        setYearsMonth(newYearsMonth);
        setWeatherSeverity(newWeatherSeverity);
        setDelays(newDelays);
        setTimeDelays(newTimeDelays);
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    update();
  }, [
    yearsMonth.length,
    weatherSeverity.length,
    delays.length,
    timeDelays.length,
    airportWeatherSeverityByRegion,
    years,
  ]);

  useEffect(() => {
    const calculateAverageYearlyChange = (tableValues) => {
      try {
        let totalChange = 0;
        let highestValue = null;
        let highestValueYear = null;
        let lowestValue = null;
        let lowestValueYear = null;

        for (let i = 1; i < tableValues.length; i++) {
          const yearlyChange = tableValues[i] - tableValues[i - 1];
          totalChange += yearlyChange;

          if (highestValue === null || tableValues[i] > highestValue) {
            highestValue = tableValues[i];
            highestValueYear = yearsMonth[i];
          }

          if (lowestValue === null) {
            lowestValue = tableValues[i - 1];
            lowestValueYear = years[i - 1];
          } else if (tableValues[i] < lowestValue) {
            lowestValue = tableValues[i];
            lowestValueYear = yearsMonth[i];
          }
        }

        const averageChange = totalChange / (tableValues.length - 1);
        return {
          averageYearlyChange: averageChange,
          highestValue: highestValue,
          highestValueYear: highestValueYear,
          lowestValue: lowestValue,
          lowestValueYear: lowestValueYear,
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    };

    setYearHighLowFirstCountryWeatherSeverity(
      calculateAverageYearlyChange(weatherSeverity),
    );

    setYearHighLowFirstCountryDelays(calculateAverageYearlyChange(delays));

    setYearHighLowFirstCountryTimeDelays(
      calculateAverageYearlyChange(timeDelays),
    );
  }, [yearsMonth, weatherSeverity, years, delays, timeDelays]);

  return (
    <>
      <div className="grid-row-2 grid">
        <div className="flex items-center justify-center">
          <SelectedRegion
            selectedRegion={region}
            setSelectedRegion={setRegion}
            regions={regions}
          />
        </div>

        <div>
          <WeatherSeverityGraph
            isLoading={isLoading}
            yearsMonth={yearsMonth}
            weatherSeverity={weatherSeverity}
            delays={delays}
            timeDelays={timeDelays}
            yearHighLowFirstCountryWeatherSeverity={
              yearHighLowFirstCountryWeatherSeverity
            }
            yearHighLowFirstCountryDelays={yearHighLowFirstCountryDelays}
            yearHighLowFirstCountryTimeDelays={
              yearHighLowFirstCountryTimeDelays
            }
          />
        </div>
      </div>
    </>
  );
}

function WeatherSeverityGraph({
  isLoading,
  yearsMonth,
  weatherSeverity,
  delays,
  timeDelays,
  yearHighLowFirstCountryWeatherSeverity,
  yearHighLowFirstCountryDelays,
  yearHighLowFirstCountryTimeDelays,
}) {
  return (
    <div className="mt-4 rounded-lg border bg-gray-500 shadow-md">
      {isLoading ? (
        <DisplayLoading />
      ) : (
        <div className="grid grid-cols-6">
          <SidePanel
            country={'Weather Severity'}
            yearlyPercentageChange={
              yearHighLowFirstCountryWeatherSeverity.averageYearlyChange
            }
            highestPercentageYear={{
              year: yearHighLowFirstCountryWeatherSeverity.highestValueYear,
              percentage: yearHighLowFirstCountryWeatherSeverity.highestValue,
            }}
            lowestPercentageYear={{
              year: yearHighLowFirstCountryWeatherSeverity.lowestValueYear,
              percentage: yearHighLowFirstCountryWeatherSeverity.lowestValue,
            }}
            bgColorTop={styles['left-bg']}
            bgColorBottom={styles['left-bg-less']}
          />

          <div className="col-span-4 m-2 rounded-lg border bg-gray-300 shadow-md">
            <AirportWeatherSeverityLineChart
              labels={yearsMonth}
              weatherSeverity={weatherSeverity}
              delays={delays}
              timeDelays={timeDelays}
            />
          </div>

          <SidePanel
            country={'Number of Delays'}
            yearlyPercentageChange={
              yearHighLowFirstCountryDelays.averageYearlyChange
            }
            highestPercentageYear={{
              year: yearHighLowFirstCountryDelays.highestValueYear,
              percentage: yearHighLowFirstCountryDelays.highestValue,
            }}
            lowestPercentageYear={{
              year: yearHighLowFirstCountryDelays.lowestValueYear,
              percentage: yearHighLowFirstCountryDelays.lowestValue,
            }}
            bgColorTop={styles['right-bg']}
            bgColorBottom={styles['right-bg-less']}
          />
        </div>
      )}
    </div>
  );
}

function DisplayLoading() {
  return (
    <div className="mt-5 grid grid-rows-2 items-center justify-center text-lg font-semibold text-black">
      <Spinner />
      <p>Loading data...</p>
    </div>
  );
}
