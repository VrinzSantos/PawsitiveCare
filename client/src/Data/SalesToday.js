import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalesToday = () => {
  const [salesToday, setSalesToday] = useState(0);

  useEffect(() => {
    const getSalesToday = async () => {
      try {
        const res = await axios.get('/api/v1/analytics/sales-today', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (res.data.success) {
          setSalesToday(res.data.salesToday);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    getSalesToday();
  }, []);

  return (
    <>
      <h3 className='text-2xl text-white font-semibold mb-3 flex items-center'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-trending-up mr-2"
          width="30"
          height="30"
        >
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
        Sales Today:
      </h3>
      <p className='text-2xl text-white font-bold'>{salesToday}</p>
    </>
  );

};

export default SalesToday;