import React from 'react';

const NumberOfProducts = ({ numberOfProducts }) => {
  return (
    <>
      <h3 className='text-2xl text-white font-semibold mb-3 flex items-center'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-box mr-2"
          width="30"
          height="30"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="8" y1="8" x2="16" y2="16" />
          <line x1="8" y1="16" x2="16" y2="8" />
        </svg>
        Number of Products:
      </h3>
      <p className='text-2xl text-white font-bold'>{numberOfProducts}</p>
    </>
  );
};

export default NumberOfProducts;