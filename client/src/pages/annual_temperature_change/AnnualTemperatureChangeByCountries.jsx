import { useEffect, useState } from 'react';
import Spinner from '../../components/Spinner';
import SelectedCountry from '../../components/SelectedCountry';
import { CountriesMultiLineChart } from '../../components/graphs/CountriesMultiLineChart';
import SidePanel from '../../components/SidePanel';
import styles from './AnnualTemperatureChangeByCountries.module.css';

export default function AnnualTemperatureChangeByCountries() {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedFirstCountry, setSelectedFirstCounty] =
    useState('Afghanistan');
  const [selectedSecondCountry, setSelectedSecondCountry] = useState('Albania');
  const [annualTemperatureByCountry, setAnnualTemperatureChange] = useState([]);

  const [years, setYears] = useState([]);
  const [firstCountryTempChanges, setFirstCountryTempChanges] = useState([]);
  const [secondCountryTempChanges, setSecondCountryTempChanges] = useState([]);
  const [firstCountryGDP, setFirstCountryGDP] = useState([]);
  const [secondCountryGDP, setSecondCountryGDP] = useState([]);
  const [firstCountryCO2, setFirstCountryCO2] = useState([]);
  const [secondCountryCO2, setSecondCountryCO2] = useState([]);

  const [yearHighLowFirstCountryCO2, setYearHighLowFirstCountryCO2] = useState(
    {},
  );
  const [
    yearHighLowFirstCountryTempChange,
    setYearHighLowFirstCountryTempChange,
  ] = useState({});
  const [yearHighLowFirstCountryGDP, setYearHighLowFirstCountryGDP] = useState(
    {},
  );

  const [yearHighLowSecondCountryCO2, setYearHighLowSecondCountryCO2] =
    useState({});
  const [
    yearHighLowSecondCountryTempChange,
    setYearHighLowSecondCountryTempChange,
  ] = useState({});
  const [yearHighLowSecondCountryGDP, setYearHighLowSecondCountryGDP] =
    useState({});

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(
          `http://localhost:7000/menuDisplay/countryByAnnualTemperature`,
        );

        const data = await res.json();

        setCountries(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchAnnualTemperatureByCountries = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(
          `http://localhost:7000/annualTemperatureChange?firstCountry=${selectedFirstCountry}&secondCountry=${selectedSecondCountry}`,
        );

        const data = await res.json();
        setAnnualTemperatureChange(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnualTemperatureByCountries();
  }, [selectedFirstCountry, selectedSecondCountry]);

  useEffect(() => {
    const update = () => {
      try {
        setIsLoading(true);

        let newYears = [];
        let newFirstCountryTempChange = [];
        let newSecondCountryTempChange = [];
        let newFirstCountryGDP = [];
        let newSecondCountryGDP = [];
        let newFirstCountryCO2 = [];
        let newSecondCountryCO2 = [];

        if (
          years.length > 0 ||
          firstCountryTempChanges.length > 0 ||
          secondCountryTempChanges.length > 0 ||
          firstCountryGDP.length > 0 ||
          secondCountryGDP.length > 0 ||
          firstCountryCO2.length > 0 ||
          secondCountryCO2.length > 0
        ) {
          setYears([]);
          setFirstCountryTempChanges([]);
          setSecondCountryTempChanges([]);
          setFirstCountryGDP([]);
          setSecondCountryGDP([]);
          setFirstCountryCO2([]);
          setSecondCountryCO2([]);
        }

        annualTemperatureByCountry.map((country) => {
          newYears.push(country.year);
          newFirstCountryTempChange.push(country.firstCountryTempChange);
          newSecondCountryTempChange.push(country.secondCountryTempChange);
          newFirstCountryGDP.push(country.firstCountryGDP);
          newSecondCountryGDP.push(country.secondCountryGDP);
          newFirstCountryCO2.push(country.firstCountryCO2);
          newSecondCountryCO2.push(country.secondCountryCO2);
        });

        setYears(newYears);
        setFirstCountryTempChanges(newFirstCountryTempChange);
        setSecondCountryTempChanges(newSecondCountryTempChange);
        setFirstCountryGDP(newFirstCountryGDP);
        setSecondCountryGDP(newSecondCountryGDP);
        setFirstCountryCO2(newFirstCountryCO2);
        setSecondCountryCO2(newSecondCountryCO2);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    update();
  }, [
    annualTemperatureByCountry,
    years.length,
    firstCountryTempChanges.length,
    secondCountryTempChanges.length,
    firstCountryGDP.length,
    secondCountryGDP.length,
    firstCountryCO2.length,
    secondCountryCO2.length,
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
            highestValueYear = years[i];
          }

          if (lowestValue === null) {
            lowestValue = tableValues[i - 1];
            lowestValueYear = years[i - 1];
          } else if (tableValues[i] < lowestValue) {
            lowestValue = tableValues[i];
            lowestValueYear = years[i];
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

    setYearHighLowFirstCountryCO2(
      calculateAverageYearlyChange(firstCountryCO2),
    );
    setYearHighLowFirstCountryTempChange(
      calculateAverageYearlyChange(firstCountryTempChanges),
    );
    setYearHighLowFirstCountryGDP(
      calculateAverageYearlyChange(firstCountryGDP),
    );

    setYearHighLowSecondCountryCO2(
      calculateAverageYearlyChange(secondCountryCO2),
    );
    setYearHighLowSecondCountryTempChange(
      calculateAverageYearlyChange(secondCountryTempChanges),
    );
    setYearHighLowSecondCountryGDP(
      calculateAverageYearlyChange(secondCountryGDP),
    );
  }, [
    firstCountryCO2,
    firstCountryTempChanges,
    firstCountryGDP,
    secondCountryCO2,
    secondCountryTempChanges,
    secondCountryGDP,
    years,
  ]);

  return (
    <div className="grid-row-2 grid">
      <div className="flex items-center justify-center">
        <SelectedCountry
          selectedCountry={selectedFirstCountry}
          setSelectedCountry={setSelectedFirstCounty}
          countries={countries}
        ></SelectedCountry>
        <SelectedCountry
          selectedCountry={selectedSecondCountry}
          setSelectedCountry={setSelectedSecondCountry}
          countries={countries}
        ></SelectedCountry>
      </div>

      <div>
        <h1 className="mt-5 flex justify-center text-5xl font-bold">
          CO2 Change Graph
        </h1>
        <CO2Graph
          isLoading={isLoading}
          selectedFirstCountry={selectedFirstCountry}
          selectedSecondCountry={selectedSecondCountry}
          years={years}
          firstCountryCO2={firstCountryCO2}
          secondCountryCO2={secondCountryCO2}
          yearHighLowFirstCountryCO2={yearHighLowFirstCountryCO2}
          yearHighLowSecondCountryCO2={yearHighLowSecondCountryCO2}
        />

        <h1 className="mt-5 flex justify-center text-5xl font-bold">
          Temperature Change Graph
        </h1>
        <TemperatureChangeGraph
          isLoading={isLoading}
          selectedFirstCountry={selectedFirstCountry}
          selectedSecondCountry={selectedSecondCountry}
          years={years}
          firstCountryTempChanges={firstCountryTempChanges}
          secondCountryTempChanges={secondCountryTempChanges}
          yearHighLowFirstCountryTempChange={yearHighLowFirstCountryTempChange}
          yearHighLowSecondCountryTempChange={
            yearHighLowSecondCountryTempChange
          }
        />

        <h1 className="mt-5 flex justify-center text-5xl font-bold">
          GDP Change Graph
        </h1>
        <GDPGraph
          isLoading={isLoading}
          selectedFirstCountry={selectedFirstCountry}
          selectedSecondCountry={selectedSecondCountry}
          years={years}
          firstCountryGDP={firstCountryGDP}
          secondCountryGDP={secondCountryGDP}
          yearHighLowFirstCountryGDP={yearHighLowFirstCountryGDP}
          yearHighLowSecondCountryGDP={yearHighLowSecondCountryGDP}
        />
      </div>
    </div>
  );
}

function CO2Graph({
  isLoading,
  selectedFirstCountry,
  selectedSecondCountry,
  years,
  firstCountryCO2,
  secondCountryCO2,
  yearHighLowFirstCountryCO2,
  yearHighLowSecondCountryCO2,
}) {
  return (
    <div className="mt-4 rounded-lg border bg-gray-600 shadow-md">
      {isLoading ? (
        <DisplayLoading />
      ) : (
        <div className="grid grid-cols-6">
          <SidePanel
            country={selectedFirstCountry}
            yearlyPercentageChange={
              yearHighLowFirstCountryCO2.averageYearlyChange
            }
            highestPercentageYear={{
              year: yearHighLowFirstCountryCO2.highestValueYear,
              percentage: yearHighLowFirstCountryCO2.highestValue,
            }}
            lowestPercentageYear={{
              year: yearHighLowFirstCountryCO2.lowestValueYear,
              percentage: yearHighLowFirstCountryCO2.lowestValue,
            }}
            bgColorTop={styles['left-bg']}
            bgColorBottom={styles['left-bg-less']}
          />

          <div className="col-span-4 m-2 rounded-lg border bg-gray-300 shadow-md">
            <CountriesMultiLineChart
              labels={years}
              firstCountry={selectedFirstCountry}
              firstCountryData={firstCountryCO2}
              secondCountry={selectedSecondCountry}
              secondCountryData={secondCountryCO2}
              typeOfData="CO2 Change"
            />
          </div>
          <SidePanel
            country={selectedSecondCountry}
            yearlyPercentageChange={
              yearHighLowSecondCountryCO2.averageYearlyChange
            }
            highestPercentageYear={{
              year: yearHighLowSecondCountryCO2.highestValueYear,
              percentage: yearHighLowSecondCountryCO2.highestValue,
            }}
            lowestPercentageYear={{
              year: yearHighLowSecondCountryCO2.lowestValueYear,
              percentage: yearHighLowSecondCountryCO2.lowestValue,
            }}
            bgColorTop={styles['right-bg']}
            bgColorBottom={styles['right-bg-less']}
          />
        </div>
      )}
    </div>
  );
}

function TemperatureChangeGraph({
  isLoading,
  selectedFirstCountry,
  selectedSecondCountry,
  years,
  firstCountryTempChanges,
  secondCountryTempChanges,
  yearHighLowFirstCountryTempChange,
  yearHighLowSecondCountryTempChange,
}) {
  return (
    <div className="mt-4 rounded-lg border bg-gray-600 shadow-md">
      {isLoading ? (
        <DisplayLoading />
      ) : (
        <div className="mt-4 rounded-lg border bg-gray-500 shadow-md">
          <div className="grid grid-cols-6">
            <SidePanel
              country={selectedFirstCountry}
              yearlyPercentageChange={
                yearHighLowFirstCountryTempChange.averageYearlyChange
              }
              highestPercentageYear={{
                year: yearHighLowFirstCountryTempChange.highestValueYear,
                percentage: yearHighLowFirstCountryTempChange.highestValue,
              }}
              lowestPercentageYear={{
                year: yearHighLowFirstCountryTempChange.lowestValueYear,
                percentage: yearHighLowFirstCountryTempChange.lowestValue,
              }}
              bgColorTop={styles['left-bg']}
              bgColorBottom={styles['left-bg-less']}
            />

            <div className="col-span-4 m-2 rounded-lg border bg-gray-300 shadow-md">
              <CountriesMultiLineChart
                labels={years}
                firstCountry={selectedFirstCountry}
                firstCountryData={firstCountryTempChanges}
                secondCountry={selectedSecondCountry}
                secondCountryData={secondCountryTempChanges}
                typeOfData="Temperature Change"
              />
            </div>

            <SidePanel
              country={selectedSecondCountry}
              yearlyPercentageChange={
                yearHighLowSecondCountryTempChange.averageYearlyChange
              }
              highestPercentageYear={{
                year: yearHighLowSecondCountryTempChange.highestValueYear,
                percentage: yearHighLowSecondCountryTempChange.highestValue,
              }}
              lowestPercentageYear={{
                year: yearHighLowSecondCountryTempChange.lowestValueYear,
                percentage: yearHighLowSecondCountryTempChange.lowestValue,
              }}
              bgColorTop={styles['right-bg']}
              bgColorBottom={styles['right-bg-less']}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function GDPGraph({
  isLoading,
  selectedFirstCountry,
  selectedSecondCountry,
  years,
  firstCountryGDP,
  secondCountryGDP,
  yearHighLowFirstCountryGDP,
  yearHighLowSecondCountryGDP,
}) {
  return (
    <div className="mt-4 rounded-lg border bg-gray-600 shadow-md">
      {isLoading ? (
        <DisplayLoading />
      ) : (
        <div className="mt-4 rounded-lg border bg-gray-500 shadow-md">
          <div className="grid grid-cols-6">
            <SidePanel
              country={selectedFirstCountry}
              yearlyPercentageChange={
                yearHighLowFirstCountryGDP.averageYearlyChange
              }
              highestPercentageYear={{
                year: yearHighLowFirstCountryGDP.highestValueYear,
                percentage: yearHighLowFirstCountryGDP.highestValue,
              }}
              lowestPercentageYear={{
                year: yearHighLowFirstCountryGDP.lowestValueYear,
                percentage: yearHighLowFirstCountryGDP.lowestValue,
              }}
              bgColorTop={styles['left-bg']}
              bgColorBottom={styles['left-bg-less']}
            />

            <div className="col-span-4 m-2 rounded-lg border bg-gray-300 shadow-md">
              <CountriesMultiLineChart
                labels={years}
                firstCountry={selectedFirstCountry}
                firstCountryData={firstCountryGDP}
                secondCountry={selectedSecondCountry}
                secondCountryData={secondCountryGDP}
                typeOfData="GDP Change"
              />
            </div>

            <SidePanel
              country={selectedSecondCountry}
              yearlyPercentageChange={
                yearHighLowSecondCountryGDP.averageYearlyChange
              }
              highestPercentageYear={{
                year: yearHighLowSecondCountryGDP.highestValueYear,
                percentage: yearHighLowSecondCountryGDP.highestValue,
              }}
              lowestPercentageYear={{
                year: yearHighLowSecondCountryGDP.lowestValueYear,
                percentage: yearHighLowSecondCountryGDP.lowestValue,
              }}
              bgColorTop={styles['right-bg']}
              bgColorBottom={styles['right-bg-less']}
            />
          </div>
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
