import React, { useEffect } from 'react';
import "../styles/Dashboard.css";

const MonthlySalesChart = ({ monthlySalesData }) => {
  useEffect(() => {
    if (window.Chart && monthlySalesData) {
      const canvas = document.getElementById('monthlySalesChart');
      const ctx = canvas.getContext('2d');

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Destroy existing chart if it exists
      if (canvas.chart) {
        canvas.chart.destroy();
      }

      canvas.chart = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: monthlySalesData.map((entry) => entry.monthYear),
          datasets: [{
            label: 'Monthly Sales',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
            data: monthlySalesData.map((entry) => entry.totalAmount),
          }],
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
  }, [monthlySalesData]);

  return (
    <div className='text-center'>
      <div className="bg-white p-4">
        <h2 className="text-center font-bold mb-4">Monthly Sales Chart</h2>
        <div className="flex justify-center">
        <div style={{ width: '400px', height: '300px' }}>
          <canvas
            id="monthlySalesChart"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySalesChart;
