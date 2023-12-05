export default function SelectedRegion({
  selectedRegion,
  setSelectedRegion,
  regions,
}) {
  return (
    <>
      <label htmlFor="countries">Choose an airport</label>
      <select
        name="airport"
        id="airport"
        value={selectedRegion}
        onChange={(e) => setSelectedRegion(e.target.value)}
        className="w-50 mx-2 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-lg focus:border-blue-500 focus:ring-blue-500"
      >
        {regions.map((region) => (
          <option key={region.region} value={region.region}>
            {region.region}
          </option>
        ))}
      </select>
    </>
  );
}
