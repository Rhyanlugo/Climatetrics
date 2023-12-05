import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
);

export function CountriesMultiLineChart({
  labels,
  firstCountry,
  firstCountryData,
  secondCountry,
  secondCountryData,
  typeOfData,
}) {
  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: `Comparison of ${typeOfData} yearly percentage emission between ${firstCountry} and ${secondCountry}`,
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'right',
      },
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'x',
      },
      zoom: {
        pinch: {
          enabled: true, // Enable pinch zooming
        },
        wheel: {
          enabled: true, // Enable wheel zooming
        },
        mode: 'x',
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: `${firstCountry}`,
        data: firstCountryData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      {
        label: `${secondCountry}`,
        data: secondCountryData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y',
      },
    ],
  };

  return <Line options={options} data={data} />;
}
