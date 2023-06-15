import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './DataVis.css'
import { useSelector } from 'react-redux';

// static data
// function DataVis () {
//   const chartRef = useRef(null);
//   const today = new Date().toISOString().split('T')[0];
  
//   const chartData = {
//       labels: ['Label 1', 'Label 2', 'Label 3'],
//       datasets: [
//           {
//           label: 'Dump Truck 1',
//           backgroundColor: '#f44336',
//           data: [10, 20, 30],
//           },
//           {
//           label: 'Dump Truck 2',
//           backgroundColor: '#2196f3',
//           data: [15, 25, 35],
//           }
//       ]
//   }

//   const chartOptions = {
//       responsive: false,
//       maintainAspectRatio: false,
//       scales: {
//         x: {
//           stacked: true,
//         },
//         y: {
//           stacked: true,
//         },
//       },
//     };

//   useEffect(() => {
//       const chartElement = chartRef.current;
//       const stackedBarChart = new Chart(chartElement, {
//         type: 'bar',
//         data: chartData,
//         options: chartOptions,
//       });
    
//       return () => {
//         stackedBarChart.destroy();
//       };
//   }, []);

//   return <canvas ref={chartRef} />;

// }

function DataVis () {
  const chartRef = useRef(null);
  const today = new Date().toISOString().split('T')[0];

  const sessionUserId = useSelector(state => state.session.user._id)
      
  if (!sessionUserId) {
    console.log('Error: sessionUserId is not available');
  }
  
  const fetchData = async () => {
    try {
      const res = await axios.get('./api/exercises/');
      const data = res.data;
      // console.log(data)
      // const userExercises = [] /
      
   
      const filteredData = data.filter(obj => obj.setter._id === sessionUserId);
      console.log('Filtered data:', filteredData);
      console.log('monka')
    } catch (err) {
      console.log('Error fetching data:', err)
      
    }
  }

  fetchData()



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
          }
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