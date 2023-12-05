export default function SidePanel({
  country,
  yearlyPercentageChange,
  highestPercentageYear,
  lowestPercentageYear,
  bgColorTop,
  bgColorBottom,
}) {
  return (
    <div className="col-span-1 grid grid-rows-6 rounded-lg bg-gray-400 p-4 shadow-md">
      <div
        className={`row-span-1 flex items-center justify-center rounded-xl ${bgColorTop} text-4xl font-bold text-white`}
      >
        <h2>{country}</h2>
      </div>
      <div className={`row-span-5 mt-2 rounded-xl ${bgColorBottom} p-4`}>
        <div className="grid grid-rows-3">
          <SidePanelBox
            tracking={'Average Yearly Change'}
            value={`${Number(yearlyPercentageChange).toFixed(6)}`}
          />

          <SidePanelBox
            tracking={'Highest Year'}
            value={`${highestPercentageYear.year}: (${Number(
              highestPercentageYear.percentage,
            ).toFixed(6)})`}
          />

          <SidePanelBox
            tracking={'Lowest Year'}
            value={`${lowestPercentageYear.year}: (${Number(
              lowestPercentageYear.percentage,
            ).toFixed(6)})`}
          />
        </div>
      </div>
    </div>
  );
}

function SidePanelBox({ tracking, value }) {
  return (
    <div className="mb-4 grid grid-rows-2 justify-center rounded-lg border bg-gray-500 text-center">
      <p className="text-3xl">{tracking}</p>
      <p className="text-2xl text-white">{value}</p>
    </div>
  );
}
