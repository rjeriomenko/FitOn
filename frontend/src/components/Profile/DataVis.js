import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './DataVis.css'

function DataVis () {
    const chartRef = useRef(null);

    const chartData = {
        labels: ['Label 1', 'Label 2', 'Label 3'],
        datasets: [
            {
            label: 'Dump Truck 1',
            backgroundColor: '#f44336',
            data: [10, 20, 30],
            },
            {
            label: 'Dump Truck 2',
            backgroundColor: '#2196f3',
            data: [15, 25, 35],
            },
        ]
    }

    const chartOptions = {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      };

    useEffect(() => {
        const chartElement = chartRef.current;
        const stackedBarChart = new Chart(chartElement, {
          type: 'bar',
          data: chartData,
          options: chartOptions,
        });
      
        return () => {
          stackedBarChart.destroy();
        };
    }, []);

    return <canvas ref={chartRef} />;

}

export default DataVis;