import React from 'react';
import "../styles/Dashboard.css"

const FastestSellingProductChart = ({ fastestSellingProducts }) => {
  return (
    <div className='dashboard-container p-3 bg-gray-100 rounded shadow-md'>
      <h2 className='text-2xl font-semibold mb-4'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-lightning inline-block mr-2"
          width="40"
          height="40"
        >
          <path d="M13 2 L18 10 L11 10 L17 22 L12 14 L19 14 L13 2 Z" />
        </svg>
        Fastest Selling Products
      </h2>
      <ul className='list-none p-0'>
        {fastestSellingProducts.map((product, index) => {
          const highestStocksOut = fastestSellingProducts.reduce(
            (maxStocksOut, product) => Math.max(maxStocksOut, product.stocksOut),
            0
          );

          return product.stocksOut === highestStocksOut && (
            <li key={index} className='bg-white p-3 mb-2 rounded border border-gray-300'>
              <strong className='text-md'>{product.productName}</strong> <br /> 
              Total Sales: {product.totalSales}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FastestSellingProductChart;