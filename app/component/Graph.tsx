"use client"

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PlacementBarChart = () => {
  const data: ChartData<'bar'> = {
    labels: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Number of Placements',
        data: [100, 120, 150, 200, 180, 250, 150, 300],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
        ],
        borderColor: 'rgba(0, 0, 0, 0.8)',
        borderWidth: 1.5,
        borderRadius: 5,
        hoverBackgroundColor: 'rgba(255, 99, 132, 1)',
        hoverBorderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333',
          font: { size: 14 },
        },
      },
      title: {
        display: true,
        text: 'Placements per Year',
        font: { size: 18 },
        color: '#222',
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#444',
          font: { size: 12 },
        },
        title: {
          display: true,
          text: 'Year',
          font: { size: 14 },
          color: '#333',
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(200, 200, 200, 0.3)' },
        ticks: {
          color: '#444',
          font: { size: 12 },
        },
        title: {
          display: true,
          text: 'Number of Placements',
          font: { size: 14 },
          color: '#333',
        },
      },
    },
  };

  return (
    <div className='text-white px-24 py-16'>
      <h2 className="text-5xl font-bold text-center mb-4">Placement Statistics</h2>
      <div className="w-full h-[500px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PlacementBarChart;
