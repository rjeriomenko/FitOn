import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './DataVis.css'

function DataVis({timeGraph}) {
  const chartRef = useRef(null);
  const sessionUser = useSelector(state => state.session.user);
  const currentGoalId = sessionUser?.currentGoal?._id;
  const chartInstanceRef = useRef(null);

  const fetchExerciseEntry = async () => {
    const res = await axios.get(`./api/exercises/byGoal/${currentGoalId}`);
    const data = res.data;  
    const exerciseEntry = {};

    if (timeGraph) {
      Object.values(data).forEach(exercise => {
      const { name, time, workout: { date } } = exercise;
          
        if (!exerciseEntry[date]) {
          exerciseEntry[date] = {};
        }

        exerciseEntry[date][name] = parseInt(time);
      });

    } else {
      Object.values(data).forEach(exercise => {
        const { name, sets, reps, workout: { date } } = exercise;
            
        if (!exerciseEntry[date]) {
          exerciseEntry[date] = {};
        }
        
        exerciseEntry[date][name] = parseInt(sets * reps);
      });
      
    }

    return exerciseEntry;

  };

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const yAxisLabel = () => timeGraph ? 'Minutes Spent' : 'Reps X Sets Count'
  
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
          text: yAxisLabel()
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
  
  const createBarGraph = async () => {
    const data = await fetchExerciseEntry();
    const dates = Object.keys(data);
    dates.sort((a,b) => new Date(a) - new Date(b))

    // finds unique exercises by flattening and removes dupes
    const exercises = Array.from(
      new Set(dates.flatMap(date => Object.keys(data[date])))
    );

    const datasets = exercises.map(exercise => {
      const dataset = {
        label: exercise,
        data: dates.map(date => data[date][exercise] || 0),
        backgroundColor: generateRandomColor()
      };

      return dataset;
    });
    
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const chartData = {
      labels: dates,
      datasets: datasets
    };
    
    // creating chart
    const chartElement = chartRef.current;
    const newChart = new Chart(chartElement, {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });

    chartInstanceRef.current = newChart;
    
    return () => {
      newChart.destroy();
    }; 
  }
  
  const createDates = () => {
    let dates = [];
    let today = new Date();

    for (let i = 0; i <= 6; i++) {
      dates.push(today.toDateString());
      today.setDate(today.getDate() - 1);
    }
    return dates;
  }

  const createEmpty = () => {   
    const datasets = [
      {
        label: 'Exercise 1',
        data: [0], 
        backgroundColor: generateRandomColor()
      },
      {
        label: 'Exercise 2',
        data: [0], 
        backgroundColor: generateRandomColor()
      },
      {
        label: 'Exercise 3',
        data: [0], 
        backgroundColor: generateRandomColor()
      }
    ];

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const chartData = {
      labels: createDates(),
      datasets: datasets
    }

    const chartElement = chartRef.current;
    const newChart = new Chart(chartElement, {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    });

    chartInstanceRef.current = newChart;

    return () => {
      newChart.destroy();
    };  

  }

  useEffect(() => {
    currentGoalId ? createBarGraph() : createEmpty(); 
  }, [currentGoalId, timeGraph])
  
  
  return (
    <>
      <canvas ref={chartRef} />
    </>
  )
}
  

export default DataVis;
