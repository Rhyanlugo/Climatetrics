export default function SelectedAirport({
  selectedAirport,
  setSelectedAirport,
  airports,
}) {
  return (
    <>
      <label htmlFor="countries">Choose an airport</label>
      <select
        name="airport"
        id="airport"
        value={selectedAirport}
        onChange={(e) => setSelectedAirport(e.target.value)}
        className="w-50 mx-2 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-lg focus:border-blue-500 focus:ring-blue-500"
      >
        {airports.map((airport) => (
          <option key={airport.airport} value={airport.airport}>
            {airport.airport}
          </option>
        ))}
      </select>
    </>
  );
}
