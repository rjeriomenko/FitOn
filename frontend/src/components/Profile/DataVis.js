import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './DataVis.css'
import { useSelector } from 'react-redux';

function DataVis() {
  const chartRef = useRef(null);
  const session = useSelector(state => state.session);
  const sessionUserId = session?.user?._id;
  
  const fetchExerciseEntry = async () => {
    try {
      const res = await axios.get(`./api/users/${sessionUserId}/entries`);
      const data = res.data;
      const exerciseEntry = {};
  
      Object.keys(data).forEach(key => {
        const { exerciseEntry: { exercises, date } } = data[key];
        exerciseEntry[date] = exercises;
      });
  
      const result = {};
  
      for (const date in exerciseEntry) {
        const exerciseIds = exerciseEntry[date];
  
        const requests = exerciseIds.map(exerciseId => axios.get(`./api/exercises/${exerciseId}`));
        const responses = await Promise.all(requests);
        const exerciseData = responses.map(response => response.data);
  
        const exercises = exerciseData.reduce((acc, exercise) => {
          const { name, sets, reps } = exercise;
          acc[name] = sets * reps;
          return acc;
        }, {});
  
        result[date] = Object.entries(exercises).map(([name, total]) => ({ [name]: total }));
      }

      return result;
  
    } catch (err) {
      console.log('Error fetching data:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchExerciseEntry();
        const labels = Object.keys(data);

        const totals = {
          'Squats': [],
          'Glute Bridges': [],
          'Hip Thrusts': [],
        };

        labels.forEach(date => {
          const exercises = data[date];
          exercises.forEach(exercise => {
            const exerciseName = Object.keys(exercise)[0];
            const exerciseValue = exercise[exerciseName];
            totals[exerciseName].push(exerciseValue);
          });
        });

        const datasets = Object.entries(totals).map(([exercise, values]) => {
          return {
            label: exercise,
            backgroundColor: generateRandomColor(),
            data: values,
          };
        });

        const chartData = {
          labels: labels,
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
                text: 'Reps X Sets'
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

      } catch (err) {
        console.log('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return <canvas ref={chartRef} />;
}

export default DataVis;
