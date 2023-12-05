export default function SelectedCountry({
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
