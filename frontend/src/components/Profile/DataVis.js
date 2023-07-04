import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './DataVis.css'
import { useSelector } from 'react-redux';

function DataVis() {
  const chartRef = useRef(null);
  const sessionUser = useSelector(state => state.session.user);
  const currentGoalId = sessionUser?.currentGoal?._id;

  if (!currentGoalId) {
    let dates = [];
    let today = new Date();

    for (var i = 0; i <= 6; i++) {
      dates.push(today.toDateString());
      today.setDate(today.getDate() - 1);
    }
  }

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
      const dates = Object.keys(data);

      // finds unique exercises by flattening and removes dupes
      const exercises = Array.from(
        new Set(dates.flatMap(date => Object.keys(data[date])))
      );

      const datasets = exercises.map(exercise => {
        const dataset = {
          label: exercise,
          data: dates.map(date => data[date][exercise] || 0),
          backgroundColor: generateRandomColor(),
        };

        return dataset;
      });
      
      const chartData = {
        labels: dates,
        datasets: datasets,
      };


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
