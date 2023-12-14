import React from 'react'
import { useNavigate } from 'react-router-dom'

const DoctorList = ({doctor}) => {
    const navigate = useNavigate()
  return (
    <>
        <div className='btn w-36 mt-3'
        style={{cursor: 'pointer', backgroundColor: '#4a1e8a', color: '#fff' }} 
        onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}>
            <div className='card-header'>
            </div>
            <div className='card-body'>
                <p>
                  Book Now
                </p>
            </div>
            </div>
    </>
  )
}

export default DoctorList