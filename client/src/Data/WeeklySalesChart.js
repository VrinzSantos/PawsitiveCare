import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const WeeklySalesChart = () => {
  const [weeklySalesData, setWeeklySalesData] = useState([]);
  const [dateRange, setDateRange] = useState('');
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/v1/analytics/weekly-sales', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (res.data.success) {
          setWeeklySalesData(res.data.weeklySalesData);
          // Convert dateRange to local date string
          const start = new Date(res.data.dateRange.split(' - ')[0]);
          const end = new Date(res.data.dateRange.split(' - ')[1]);
          setDateRange(`${start.toLocaleDateString()} - ${end.toLocaleDateString()}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  

  useEffect(() => {
    // Chart.js logic for weekly sales
    if (window.Chart) {
      const canvas = document.getElementById('weeklySalesChart');
      const ctx = canvas.getContext('2d');

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Destroy existing chart if it exists
      if (canvas.chart) {
        canvas.chart.destroy();
      }

      // Get a color scale based on the values in your dataset
      const colorScale = (value) => {
        // Implement your own logic here to map values to colors
        // Example: return value > threshold ? 'blue' : 'red';
        // Adjust colors and thresholds as needed
        return value > 50 ? '#4a1e8a' : '#4a1e8a';
      };

      canvas.chart = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: weeklySalesData.map((entry) => entry._id),
          datasets: [
            {
              label: 'Weekly Sales',
              backgroundColor: weeklySalesData.map((entry) => colorScale(entry.totalSales)),
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              data: weeklySalesData.map((entry) => entry.totalSales),
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [weeklySalesData]);


  return (
  <div className="text-center mb-2 font-bold">
    <div className="bg-white">
      <h2 className="text-center mb-2 text-lg">Weekly Sales Chart</h2>
      <p className="text-center mb-10">Date Range: {dateRange}</p>
      <div className="d-flex justify-content-center">
        <div style={{ width: '400px', height: '300px' }}>
          <canvas
            id="weeklySalesChart"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  </div>
  );
};

export default WeeklySalesChart;
