export default function SelectedIndustry({
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
