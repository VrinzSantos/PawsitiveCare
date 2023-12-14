import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import moment from 'moment';
import { useParams, useLocation } from 'react-router-dom';
import { message, DatePicker, TimePicker, Button, Select, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';

const EditAppointment = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();
  const [appointment, setAppointment] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [serviceType, setServiceType] = useState([]);
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const { Option } = Select;
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Extract appointmentData from location.state
  const appointmentData = location.state ? location.state.appointmentData : null;

  useEffect(() => {
    if (appointmentData) {
      setAppointment(appointmentData);
      setDate(moment(appointmentData.date));
      setTime(moment(appointmentData.time));
    } else {
      // Handle the case where appointmentData is not available
      console.log('Appointment data not provided.');
    }
  }, [appointmentData]);

  const handleAvailability = async () => {
    if (!date || !time) {
      message.error('Please select both date and time.');
      return;
    }

    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/booking-availability', {
        doctorId: user._id,
        date,
        time,
        serviceType,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true);
        message.success(res.data.message);
      } else {
        setIsAvailable(false);
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const handleUpdateAppointment = async () => {
    if (!date || !time) {
      message.error('Please select both date and time.');
      return;
    }

    try {
      dispatch(showLoading());
      const res = await axios.put(`/api/v1/user/edit-appointment/${params.appointmentId}`, {
        date,
        time,
        serviceType,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      dispatch(hideLoading());
      if (res.data.success) {
        message.success('Appointment updated successfully');
      } else {
        message.error('Failed to update the appointment');
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  return (
    <Layout>
      <div style={{ backgroundColor: '#E8F4FE'}}>
        <div className='flex justify-center'>
          <div className='flex w-full max-w-3xl p-8 mx-auto'>
            <div className='w-full'>
            {appointment && (
                <div>
                  <form className={`flex flex-col items-center w-full max-w-3xl p-5 mx-auto mb-40 rounded-lg form-container mt-16 ${isHovered ? 'hovered-background' : ''}`}onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}  
                  style={{ backgroundColor: '#E8F4FE', height: "600px" }}>
                  <h3 className='font-bold text-center mb-3 text-3xl'><span class="text-warning">Edit</span> <span class="text-secondary">Appointment</span></h3>
                  <h4>Doctor: {appointment.doctorInfo.name}</h4>
                  <h4>Email: {appointment.doctorInfo.email}</h4>
                  <h4> Time Available: {appointment.doctorInfo.timeAvailable ? `${appointment.doctorInfo.timeAvailable[0]} - ${appointment.doctorInfo.timeAvailable[1]}` : 'N/A'}</h4>
                  <div className='flex w-full max-w-3xl mx-auto'>
                    <div className='w-full mt-3'>
              <Select
                mode="multiple"
                placeholder="Select service types"
                value={serviceType}
                onChange={(values) => setServiceType(values)}
                className='w-full'
              >
                <Option value="medication">Medication</Option>
                <Option value="vaccination">Vaccination</Option>
                <Option value="checkup">Checkup</Option>
                <Option value="sugery">Surgery</Option>
                <Option value="lab test">Lab Test</Option>
                <Option value="deworming">Deworming</Option>
              </Select>

              <div className='d-flex flex-column max-w-screen-lg sm:w-96'>
              <Input.TextArea 
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='mt-4'
              />
              <DatePicker
                format="YYYY-MM-DD"
                className='mt-4'
                onChange={(value) => {
                setDate(value);
                }}
              />
              <TimePicker
                format="hh:mm A"
                className='mt-4'
                onChange={(value) => {
                  setTime(value);
                }}
              />
              <Button className='btn bg-primary text-white mt-4 py-1' onClick={handleAvailability}>
                Check Availability
              </Button>
              {!isAvailable && (
                <Button style={{ backgroundColor: '#4a1e8a', color: '#fff' }} className='btn mt-4 mb-60 py-1' onClick={handleUpdateAppointment}>
                  Update Appointment
                </Button>
              )}
              </div>
              </div>
              </div>
            </form>
          </div>
          )}
          </div>
          </div>
          </div>
          </div>
    </Layout>
  );
};

export default EditAppointment;
