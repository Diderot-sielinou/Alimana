// app/dashboard/SalesChart.tsx
'use client';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function SalesChart() {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Revenue',
        data: [120000, 130000, 140000, 150000, 140000],
        borderColor: 'rgb(99,102,241)',
        fill: false,
      },
      {
        label: 'Profit',
        data: [40000, 42000, 45000, 50000, 48000],
        borderColor: 'rgb(34,197,94)',
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
}
