import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import "../styles/Dashboard.css"  

const ProductCategoryDistributionChart = ({ categoryDistribution }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categoryDistribution.map((category) => category._id),
          datasets: [
            {
              data: categoryDistribution.map((category) => category.count),
              backgroundColor: categoryDistribution.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`),
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              position: 'top', // Set legend position to bottom
              align: 'start',   // Center-align the legend
              labels: {
                boxWidth: 20,   // Adjust the box height for a single row
              },
            },
          },
        },
      });

      return () => {
        chart.destroy(); // Cleanup chart when the component is unmounted
      };
    }
  }, [categoryDistribution]);

  return (
    <div className='flex text-center'>
    <div className="container3 bg-white">
      <h2 className="text-center mb-2 font-bold ">Product Category Distribution</h2>
      <div className="flex justify-center">
        <div style={{ width: '300px', height: '300px' }}>
        <canvas ref={chartRef}  style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProductCategoryDistributionChart;
