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

export function AirportWeatherSeverityLineChart({
  labels,
  weatherSeverity,
  delays,
  timeDelays,
}) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
      tooltip: {
        skipNull: false,
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
        label: `Weather Severity`,
        data: weatherSeverity,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Number of Delays',
        data: delays,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Total time of Delays (by hour)',
        data: timeDelays,
        borderColor: 'rgb(256, 204, 35)',
        backgroundColor: 'rgba(256, 204, 35, 0.5)',
      },
    ],
  };

  return <Line options={options} data={data} />;
}
