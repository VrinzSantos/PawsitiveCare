import React from 'react';

const NumberOfUsers = ({ userCount }) => {
  return (
    <>
      <h2 className='text-2xl text-white font-semibold mb-3 flex items-center'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-user mr-2"
          width="24"
          height="24"
        >
          <path d="M12 2 C14.2091 2 16 3.79086 16 6 C16 8.20914 14.2091 10 12 10 C9.79086 10 8 8.20914 8 6 C8 3.79086 9.79086 2 12 2 Z M12 14 C14.2091 14 18 15.7909 18 18 L18 20 L6 20 L6 18 C6 15.7909 9.79086 14 12 14 Z" />
        </svg>
        Number of Users:
      </h2>
      <p className='text-2xl text-white font-bold'>{userCount}</p>
    </>
  );
};

export default NumberOfUsers;