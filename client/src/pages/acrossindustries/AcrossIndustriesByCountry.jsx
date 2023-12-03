import { useEffect, useState } from 'react';
import { CountriesMultiLineChart } from '../../components/CountriesMultiLineChart';
import Spinner from '../../components/Spinner';

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
      let newYears = [];
      let newFirstCountryPer = [];
      let newSecondCountryPer = [];

      if (
        newYears.length > 0 ||
        newFirstCountryPer.length > 0 ||
        newSecondCountryPer.length > 0
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
    };

    update();
  }, [industriesByCountry]);

  return (
    <>
      <SetSelectedCountry
        selectedCountry={selectedFirstCountry}
        setSelectedCountry={setSelectedFirstCounty}
        countries={countries}
      ></SetSelectedCountry>
      <SetSelectedCountry
        selectedCountry={selectedSecondCountry}
        setSelectedCountry={setSelectedSecondCountry}
        countries={countries}
      ></SetSelectedCountry>
      <SetSelectedIndustry
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        industries={industries}
      />

      <div className="mt-4 flex items-center justify-center rounded-lg border bg-white shadow-md">
        {isLoading ? (
          <div className="text-bl mt-5 grid grid-rows-2 items-center justify-center text-lg font-semibold text-black">
            <Spinner />
            <p>Loading data...</p>
          </div>
        ) : (
          <CountriesMultiLineChart
            labels={years}
            firstCountry={selectedFirstCountry}
            firstCountryPercentage={firstCountryPercentage}
            secondCountry={selectedSecondCountry}
            secondCountryPercentage={secondCountryPercentage}
            industry={selectedIndustry}
          />
        )}
      </div>
    </>
  );
}

function SetSelectedCountry({
  selectedCountry,
  setSelectedCountry,
  countries,
}) {
  return (
    <>
      <label htmlFor="countries">Choose a country</label>
      <select
        name="countries"
        id="countries"
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        className="w-50 mx-2 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
      >
        {countries.map((country) => (
          <option key={country.countryName} value={country.countryName}>
            {country.countryName}
          </option>
        ))}
      </select>
    </>
  );
}

function SetSelectedIndustry({
  selectedIndustry,
  setSelectedIndustry,
  industries,
}) {
  return (
    <>
      <label htmlFor="countries">Choose an industry</label>
      <select
        name="countries"
        id="countries"
        value={selectedIndustry}
        onChange={(e) => setSelectedIndustry(e.target.value)}
        className="mx-2 w-72 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
      >
        {industries.map((industry) => (
          <option key={industry.industryName} value={industry.industryName}>
            {industry.industryName}
          </option>
        ))}
      </select>
    </>
  );
}
