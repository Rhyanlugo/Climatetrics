import { useEffect, useState } from 'react';
import { ContinentBarChart } from '../../components/ContinentBarChart';
import Spinner from '../../components/Spinner';

export default function AcrossIndustriesByContinent() {
  const [continents, setContinents] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedIndustry, setSelectedIndustry] = useState(
    'Accomodation and food services',
  );
  const [selectedContinent, setSelectedContinent] = useState('Asia');

  const [industriesByContinent, setIndustriesByContinent] = useState([]);

  const [years, setYears] = useState([]);
  const [ratioChange, setRatioChange] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(
          `http://localhost:7000/menuDisplay/continentByCO2`,
        );

        const data = await res.json();

        setContinents(data);
      } catch (err) {
        console.error('There was an error fetching the countries.');
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
        console.error('There was an error fetching the countries.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  useEffect(() => {
    const fetchIndustriesByContinent = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(
          `http://localhost:7000/industryByContinent?continent=${selectedContinent}&industry=${selectedIndustry}`,
        );

        const data = await res.json();
        setIndustriesByContinent(data);
      } catch (err) {
        console.error('There was an error fetching the data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndustriesByContinent();
  }, [selectedContinent, selectedIndustry]);

  useEffect(() => {
    const update = () => {
      let newYear = [];
      let newRatioChange = [];

      if (years.length > 0 || ratioChange.length > 0) {
        setYears([]);
        setRatioChange([]);
      }

      industriesByContinent.map((continentByYear) => {
        newYear.push(continentByYear.year);
        newRatioChange.push(continentByYear.ratioChange * 100);
      });

      setYears(newYear);
      setRatioChange(newRatioChange);
    };

    update();
  }, [industriesByContinent, ratioChange.length, years.length]);

  return (
    <>
      <div className="flex items-center">
        <SetSelectedContinent
          selectedContinent={selectedContinent}
          setSelectedContinent={setSelectedContinent}
          continents={continents}
        ></SetSelectedContinent>
        <SetSelectedIndustry
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          industries={industries}
        />
      </div>
      <div className="mt-4 flex items-center justify-center rounded-lg border bg-white shadow-md">
        {isLoading ? (
          <div className="text-bl mt-5 grid grid-rows-2 items-center justify-center text-lg font-semibold text-black">
            <Spinner />
            <p>Loading data...</p>
          </div>
        ) : (
          <ContinentBarChart
            continent={selectedContinent}
            industry={selectedIndustry}
            years={years}
            ratioChange={ratioChange}
          />
        )}
      </div>
    </>
  );
}

function SetSelectedContinent({
  selectedContinent,
  setSelectedContinent,
  continents,
}) {
  return (
    <div>
      <label htmlFor="continents">Choose a continent</label>
      <select
        name="continents"
        id="continents"
        value={selectedContinent}
        onChange={(e) => setSelectedContinent(e.target.value)}
        className="mx-2 w-36 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
      >
        {continents.map((continent) => (
          <option key={continent.continentName} value={continent.continentName}>
            {continent.continentName}
          </option>
        ))}
      </select>
    </div>
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
