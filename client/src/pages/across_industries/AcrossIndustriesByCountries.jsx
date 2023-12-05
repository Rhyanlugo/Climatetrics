import { useEffect, useState } from 'react';
import { CountriesMultiLineChart } from '../../components/graphs/CountriesMultiLineChart';
import Spinner from '../../components/Spinner';
import SelectedCountry from '../../components/SelectedCountry';
import SelectedIndustry from '../../components/SelectedIndustry';
import SidePanel from '../../components/SidePanel';

import styles from './AcrossIndustriesByCountries.module.css';

export default function AcrossIndustriesByCountry() {
  const [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedIndustry, setSelectedIndustry] = useState(
    'Accomodation and food services',
  );
  const [selectedFirstCountry, setSelectedFirstCounty] = useState('Argentina');
  const [selectedSecondCountry, setSelectedSecondCountry] =
    useState('Australia');

  const [industriesByCountry, setIndustriesByCountry] = useState([]);

  const [years, setYears] = useState([]);
  const [firstCountryPercentage, setFirstCountryPercentage] = useState([]);
  const [secondCountryPercentage, setSecondCountryPercentage] = useState([]);

  const [averageYearlyChangeFirstCountry, setAverageYearlyChangeFirstCountry] =
    useState(null);
  const [
    averageYearlyChangeSecondCountry,
    setAverageYearlyChangeSecondCountry,
  ] = useState(null);

  const [
    highestPercentageYearFirstCountry,
    setHighestPercentageYearFirstCountry,
  ] = useState({ percentage: null, year: null });
  const [
    highestPercentageYearSecondCountry,
    setHighestPercentageYearSecondCountry,
  ] = useState({ percentage: null, year: null });

  const [
    lowestPercentageYearFirstCountry,
    setLowestPercentageYearFirstCountry,
  ] = useState({ percentage: null, year: null });
  const [
    lowestPercentageYearSecondCountry,
    setLowestPercentageYearSecondCountry,
  ] = useState({ percentage: null, year: null });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(
          `http://localhost:7000/menuDisplay/countryByCO2`,
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
    const fetchIndustries = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(
          `http://localhost:7000/menuDisplay/industryByCO2`,
        );

        const data = await res.json();

        setIndustries(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  useEffect(() => {
    const fetchIndustriesByCountry = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(
          `http://localhost:7000/industryByCountries?firstCountry=${selectedFirstCountry}&secondCountry=${selectedSecondCountry}&industry=${selectedIndustry}`,
        );

        const data = await res.json();
        setIndustriesByCountry(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndustriesByCountry();
  }, [selectedFirstCountry, selectedSecondCountry, selectedIndustry]);

  useEffect(() => {
    const update = () => {
      try {
        setIsLoading(true);
        let newYears = [];
        let newFirstCountryPer = [];
        let newSecondCountryPer = [];

        if (
          years.length > 0 ||
          firstCountryPercentage.length > 0 ||
          secondCountryPercentage.length > 0
        ) {
          setYears([]);
          setFirstCountryPercentage([]);
          setSecondCountryPercentage([]);
        }

        industriesByCountry.map((comparison) => {
          newYears.push(comparison.year);
          newFirstCountryPer.push(comparison.firstCountryPercentage * 100);
          newSecondCountryPer.push(comparison.secondCountryPercentage * 100);
        });

        setYears(newYears);
        setFirstCountryPercentage(newFirstCountryPer);
        setSecondCountryPercentage(newSecondCountryPer);
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    update();
  }, [
    industriesByCountry,
    years.length,
    firstCountryPercentage.length,
    secondCountryPercentage.length,
  ]);

  useEffect(() => {
    const calculateAverageYearlyChange = (percentageArray) => {
      try {
        let totalChange = 0;
        let highestPercentage = null;
        let highestPercentageYear = null;
        let lowestPercentage = null;
        let lowestPercentageYear = null;

        for (let i = 1; i < percentageArray.length; i++) {
          const yearlyChange = percentageArray[i] - percentageArray[i - 1];
          totalChange += yearlyChange;

          if (
            highestPercentage === null ||
            percentageArray[i] > highestPercentage
          ) {
            highestPercentage = percentageArray[i];
            highestPercentageYear = years[i];
          }

          if (lowestPercentage === null) {
            lowestPercentage = percentageArray[i];
            lowestPercentageYear = years[i];
          } else if (percentageArray[i] < lowestPercentage) {
            lowestPercentage = percentageArray[i];
            lowestPercentageYear = years[i];
          }
        }

        const averageChange = totalChange / (percentageArray.length - 1);
        return {
          averageYearlyChange: averageChange,
          highestPercentage: highestPercentage,
          highestYear: highestPercentageYear,
          lowestPercentage: lowestPercentage,
          lowestYear: lowestPercentageYear,
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    };

    const firstCountry = calculateAverageYearlyChange(firstCountryPercentage);
    setAverageYearlyChangeFirstCountry(firstCountry.averageYearlyChange);
    setHighestPercentageYearFirstCountry({
      percentage: firstCountry.highestPercentage,
      year: firstCountry.highestYear,
    });
    setLowestPercentageYearFirstCountry({
      percentage: firstCountry.lowestPercentage,
      year: firstCountry.lowestYear,
    });

    const secondCountry = calculateAverageYearlyChange(secondCountryPercentage);
    setAverageYearlyChangeSecondCountry(secondCountry.averageYearlyChange);
    setHighestPercentageYearSecondCountry({
      percentage: secondCountry.highestPercentage,
      year: secondCountry.highestYear,
    });
    setLowestPercentageYearSecondCountry({
      percentage: secondCountry.lowestPercentage,
      year: secondCountry.lowestYear,
    });
  }, [firstCountryPercentage, secondCountryPercentage, years]);

  return (
    <>
      <div className="flex items-center justify-center">
        <SelectedCountry
          selectedCountry={selectedFirstCountry}
          setSelectedCountry={setSelectedFirstCounty}
          countries={countries}
        />
        <SelectedCountry
          selectedCountry={selectedSecondCountry}
          setSelectedCountry={setSelectedSecondCountry}
          countries={countries}
        />
        <SelectedIndustry
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          industries={industries}
        />
      </div>

      <div className="mt-4 rounded-lg border bg-gray-500 shadow-md">
        {isLoading ? (
          <DisplayLoading />
        ) : (
          <div className="grid grid-cols-6">
            <SidePanel
              country={selectedFirstCountry}
              yearlyPercentageChange={averageYearlyChangeFirstCountry}
              highestPercentageYear={highestPercentageYearFirstCountry}
              lowestPercentageYear={lowestPercentageYearFirstCountry}
              bgColorTop={styles['left-bg']}
              bgColorBottom={styles['left-bg-less']}
            />

            <div className="col-span-4 m-2 rounded-lg border bg-gray-300 shadow-md">
              <CountriesMultiLineChart
                labels={years}
                firstCountry={selectedFirstCountry}
                firstCountryData={firstCountryPercentage}
                secondCountry={selectedSecondCountry}
                secondCountryData={secondCountryPercentage}
                typeOfData={selectedIndustry}
              />
            </div>

            <SidePanel
              country={selectedSecondCountry}
              yearlyPercentageChange={averageYearlyChangeSecondCountry}
              highestPercentageYear={highestPercentageYearSecondCountry}
              lowestPercentageYear={lowestPercentageYearSecondCountry}
              bgColorTop={styles['right-bg']}
              bgColorBottom={styles['right-bg-less']}
            />
          </div>
        )}
      </div>
    </>
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
