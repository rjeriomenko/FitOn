import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './DataVis.css'
import { useSelector } from 'react-redux';

function DataVis() {
  const chartRef = useRef(null);
  const session = useSelector(state => state.session);
  const sessionUserId = session?.user?._id;
  const currentGoalId = session?.user?.currentGoal?._id;

  const fetchTimedExerciseEntry = async () => {
    const res = await axios.get(`./api/exercises/byGoal/${currentGoalId}`);
    const data = res.data;  
    const exerciseEntry = {};
    
    Object.values(data).forEach(exercise => {
      const { name, time, workout: { date } } = exercise;
          
      if (!exerciseEntry[date]) {
        exerciseEntry[date] = {};
      }

      exerciseEntry[date][name] = parseInt(time);
    });

    return exerciseEntry;
  };

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    const createStackedBarChart = async () => {
      const data = await fetchTimedExerciseEntry();

      const chartData = {
        labels: Object.keys(data),
        datasets: Object.keys(data).map((date) => ({
          label: date,
          data: Object.entries(data[date]).map(([exercise, value]) => value),
          backgroundColor: generateRandomColor(),
      })),
    };

    console.log(chartData)

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            size: 14
          }
        }
      },
      y: {
        stacked: true,
        ticks: {
          font: {
            size: 14
          }
        },
        title: {
          display: true, 
          text: 'Minutes Spent'
        }
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 16
          },
        },
      },
    },
  }
        

  // creating chart
  const chartElement = chartRef.current;
  const stackedBarChart = new Chart(chartElement, {
    type: 'bar',
    data: chartData,
    options: chartOptions
  });

    return () => {
      stackedBarChart.destroy();
    };     
  }
  
    createStackedBarChart();

  }, [])


  return (
    <>
      <canvas ref={chartRef} />
    </>
  )
}

export default DataVis;
