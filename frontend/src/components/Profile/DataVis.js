import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getGoalKeyExercises, fetchGoalExercises } from '../../store/exercises';
import Chart from 'chart.js/auto';
import axios from 'axios';
import Loading from './Loading';
import './DataVis.css';

function DataVis({ user, timeGraph }) {
  const dispatch = useDispatch();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentGoalId = user.currentGoal?._id;
  
  const goalExercises = useSelector(getGoalKeyExercises);
  
  const fetchExerciseEntry = async () => {
    setIsLoading(true);
    const res = await axios.get(`/api/exercises/byGoal/${currentGoalId}`);
    const data = res.data;  
    const exerciseEntry = {};

    if (timeGraph) {
      Object.values(data).forEach(exercise => {
        const { name, time, workout: { date } } = exercise;
        const dateObj = new Date(date);
        const formattedDate = dateObj.toDateString();

        if (!exerciseEntry[formattedDate]) {
          exerciseEntry[formattedDate] = {};
        }

        if (!exerciseEntry[formattedDate][name]) {
          exerciseEntry[formattedDate][name] = parseInt(time);
        } else {
          exerciseEntry[formattedDate][name] += parseInt(time);
        }

      })

    } else {
      Object.values(data).forEach(exercise => {
        const { name, sets, reps, workout: { date } } = exercise;
        const dateObj = new Date(date);
        const formattedDate = dateObj.toDateString();
        
        if (!exerciseEntry[formattedDate]) {
          exerciseEntry[formattedDate] = {};
        }
        
        if (!exerciseEntry[formattedDate][name]) {
          exerciseEntry[formattedDate][name] = parseInt(sets * reps);
        } else {
          exerciseEntry[formattedDate][name] += parseInt(sets * reps);
        }

      })
      
    }

    setIsLoading(false);

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
    // fetches data
    const data = await fetchExerciseEntry();
    const dates = Object.keys(data);
    dates.sort((a,b) => new Date(a) - new Date(b));

    // finds unique exercises by flattening dates
    const exercises = Array.from(
      new Set(dates.flatMap(date => Object.keys(data[date])))
    );
    
    // creates datasets by matching date to exercise 
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
    dispatch(fetchGoalExercises(currentGoalId));
    if (currentGoalId) { fetchExerciseEntry() };
    currentGoalId ? createBarGraph() : createEmpty(); 
  }, [currentGoalId, timeGraph])
  
  return (
    <>
      {isLoading ? <Loading />  : <canvas ref={chartRef} />}
      {/* <canvas ref={chartRef} /> */}
    </>
  )
}
  

export default DataVis;
