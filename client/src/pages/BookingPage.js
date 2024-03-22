import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { TimePicker, message, DatePicker, Select, Input, Modal, Button } from 'antd';
import { useSelector } from 'react-redux';
// import { showLoading, hideLoading } from '../redux/features/alertSlice'; // Commented out for simplicity

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  // const dispatch = useDispatch(); // Commented out for simplicity
  const [doctors, setDoctors] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [serviceType, setServiceType] = useState([]);
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const { Option } = Select;

  const handleShowTermsModal = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  const handleAcceptTerms = () => {
    setTermsChecked(true);
    setShowTermsModal(false);
  };

  const handleCancelTerms = () => {
    setShowTermsModal(false);
    if (!termsChecked) {
      window.location.href = '/';
    }
  };

  const getUserData = async () => {
    try {
      if (!user) {
        return;
      }

      const res = await axios.post('/api/v1/doctor/getDoctorById', { doctorId: params.doctorId }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token'),
        },
      });

      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isDateAvailable = (currentDate) => {
    const formattedDate = currentDate.format('YYYY-MM-DD');
    const matchingDate = availableDates.find((dateInfo) => dateInfo.date === formattedDate);
    return matchingDate ? matchingDate.isAvailable : false;
};

  const handleCheckAvailability = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('/api/v1/user/booking-availability', {
            doctorId: params.doctorId,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (res.data.success) {
            const availableDates = res.data.availableDates.map(dateInfo => ({
                date: new Date(dateInfo.date),  // Convert date string to Date object
                isAvailable: dateInfo.isAvailable,  // Use the availability status from the server
            }));
            
            setAvailableDates(availableDates);
            setShowAvailabilityModal(true);
        } else {
            setIsAvailable(false);
            message.error(res.data.message);
        }
    } catch (error) {
        console.log(error);
    }
};

  const handleBooking = async () => {
    if (!date || !time || !termsChecked) {
      message.error('Please select both date and time and agree to the terms and conditions.');
      return;
    }
  
    // Ensure that the selected time is between 9:00 am and 9:00 pm
    const selectedDateTime = new Date(`${date.format('YYYY-MM-DD')} ${time.format('HH:mm')}`);
    const startTimeConstraint = new Date(`${date.format('YYYY-MM-DD')} 09:00`);
    const endTimeConstraint = new Date(`${date.format('YYYY-MM-DD')} 21:00`);
  
    if (selectedDateTime < startTimeConstraint || selectedDateTime > endTimeConstraint) {
      message.error('Invalid time. Please select a time between 9:00 am and 9:00 pm.');
      return;
    }
  
    try {
      const res = await axios.post('/api/v1/user/book-appointment', {
        doctorId: params.doctorId,
        userId: user._id,
        doctorInfo: doctors,
        userInfo: user,
        date,
        time,
        serviceType,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (res.data.success) {
        alert('Appointment Booked Successfully');
      }
    } catch (error) {
      alert('Appointment Booking Unsuccessful');
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div style={{ backgroundColor: '#E8F4FE'}}>
        <div className='flex justify-center'>
          <div className='flex w-full max-w-3xl p-8 mx-auto'>
            <div className='w-full'>
              {doctors && (
                <div>
                  <form className={`flex flex-col items-center w-full max-w-3xl p-5 mx-auto mb-40 rounded-lg form-container mt-16 ${isHovered ? 'hovered-background' : ''}`}onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}  style={{ backgroundColor: '#E8F4FE', height: "650px" }}>
                  <h3 className='font-bold text-center mb-3 text-3xl'><span class="text-warning">Make an</span> <span class="text-secondary">Appointment</span></h3>
                  <h4> Dr. {doctors.name}</h4>
                  <h4> Email: {doctors.email}</h4>
                  <h4> Time Available: {doctors.timeAvailable ? `${doctors.timeAvailable[0]} - ${doctors.timeAvailable[1]}` : 'N/A'}</h4>
                  <div className='flex w-full max-w-3xl mx-auto'>
                    <div className='w-full mt-3'>
                    <Select
                      mode="multiple"
                      placeholder="Select service types"
                      value={serviceType}
                      onChange={(values) => setServiceType(values)}
                      className='w-full'
                    >
                      <Option value="Medication">Medication</Option>
                      <Option value="Vaccination">Vaccination</Option>
                      <Option value="Checkup">Checkup</Option>
                      <Option value="Surgery">Surgery</Option>
                      <Option value="Lab test">Lab Test</Option>
                      <Option value="Deworming">Deworming</Option>
                    </Select>

                    <div className='d-flex flex-column max-w-screen-lg sm:w-96'>
                      <Input.TextArea
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='mt-4'
                      />
                      <DatePicker
                        type="date"
                        format="YYYY-MM-DD"
                        className='mt-4'
                        onChange={(value) => {
                          setDate(value);
                      }}
                      disabledDate={(current) => current && !isDateAvailable(current)}
                      />
                      <TimePicker
                        format="hh:mm A"
                        className='mt-4'
                        onChange={(value) => {
                          setTime(value);
                        }}
                      />

                      <div className="mt-3">
                        {!termsChecked && (
                          <label>
                            <input
                              type="checkbox"
                              checked={termsChecked}
                              onChange={() => setTermsChecked(!termsChecked)}
                              className="mr-2"
                            />
                            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                              I agree to the
                              <button
                                className='btn btn-link'
                                onClick={(e) => handleShowTermsModal(e)}
                                style={{ display: termsChecked ? 'none' : 'inline', marginRight: '0px' }}
                              >
                                Terms and Conditions
                              </button>
                            </span>
                          </label>
                        )}
                      </div>

                      <button
                        className='bg-primary mt-3 text-white py-2 rounded-lg'
                        onClick={handleCheckAvailability}
                        disabled={!termsChecked}
                      >
                        Check Availability
                      </button>
                      {!isAvailable && (
                        <button
                        className='py-2 rounded-lg mt-4'
                          style={{cursor: 'pointer', backgroundColor: '#4a1e8a', color: '#fff' }}
                          onClick={handleBooking}
                          disabled={!termsChecked}
                        >
                          Book Now
                        </button>
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
      {/* Terms Modal */}
      <Modal
        title="Terms and Conditions"
        className='w-50'
        visible={showTermsModal}
        onCancel={handleCancelTerms}
        footer={[
          <div className='flex justify-center'>
            <Button key="accept" className='btn bg-success form-btn ml-3 text-white' type="primary" onClick={handleAcceptTerms}>
              Accept <i className='pl-2 fa fa-check'></i>
            </Button>,

            <Button className='btn bg-warning m-0 form-btn text-white' key="cancel" onClick={handleCancelTerms}>
              Cancel <i className='pl-2 fa fa-close'></i>
            </Button>,
          </div>
        ]}
      >
        {/* Include your terms and conditions text here */}
        <p className='mt-4 mb-4 text-center'>Your Vets Animal Clinic Appointment Booking Terms and Conditions</p>

        <p className='font-bold mt-2'>1. Acceptance of Terms</p>
        <p>By booking an appointment with Your Vets Animal Clinic, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully before making an appointment.</p>

        <p className='mb-2 mt-2'>
          <p className='font-bold'>2. Booking Process</p>
          <p>a. Appointments can be booked through our web app.</p>
          <p>b. All appointments are subject to availability.</p>
          c. Confirmation of an appointment will be visible in the app, and clients will receive a notification when the appointment is approved or rejected.
        </p>

        <p className=' mt-2 font-bold'>3. Cancellation and Rescheduling</p>
        <p>a. Clients must provide at least a 1-day notice for cancellations or rescheduling.</p>
        <p>b.Once an appointment has been approved, clients cannot cancel or update the appointment through the app. Please contact Your Vets Animal Clinic directly for any changes.</p>
        <p>c. Failure to provide timely notice may affect the scheduling of future appointments.</p>

        <p className='mb-2 mt-2'>
          <p className='font-bold'>4. Late Arrivals</p>
          <p>a. Clients are expected to arrive on time for their appointments.</p>
          <p>b. Late arrivals may result in a shortened appointment or rescheduling.</p>
        </p>

        <p className='mb-2 mt-2'>
          <p className='font-bold'>5. Changes to Appointments</p>
          <p>a. Your Vets Animal Clinic reserves the right to reschedule or cancel appointments due to unforeseen circumstances.</p>
          <p>b. Every effort will be made to provide advance notice in such situations.</p>
        </p>

        <p className='mb-2 mt-2'>
          <p className='font-bold'>6. Client Responsibilities</p>
          <p>a. Clients are responsible for providing accurate and complete information during the booking process.</p>
          <p>b. Clients are responsible for informing Your Vets Animal Clinic of any relevant health or safety concerns regarding their pets.</p>
        </p>

        <p className='mb-2 mt-2'>
          <p className='font-bold'>7. Confidentiality</p>
          <p>a. All information shared during appointments is treated with the utmost confidentiality.</p>
          <p>b. Your Vets Animal Clinic adheres to privacy and data protection laws.</p>
        </p>

        <p className='mb-2 mt-2'>
          <p className='font-bold'>8. Liability</p>
          <p>a. Your Vets Animal Clinic is not liable for any injuries, damages, or losses incurred during appointments.</p>
          <p>b. Clients and their pets participate at their own risk.</p>
        </p>

        <p className='mb-3 mt-2'>
          <p className='font-bold'>9. Changes to Terms</p>
          <p>a. Your Vets Animal Clinic reserves the right to modify these terms and conditions at any time.</p>
          <p>b. Clients will be notified of any changes.</p>
        </p>
      </Modal>

      {/* Availability Modal */}
      <Modal
      
        title="Available Dates"
        className='w-25 text-center'
        visible={showAvailabilityModal}
        onCancel={() => setShowAvailabilityModal(false)}
        footer={[
          <div className='flex justify-center'>
          <Button className='btn bg-warning m-0 form-btn py-1 text-white' key="close" onClick={() => setShowAvailabilityModal(false)}>
            Close <i className='pl-2 fa fa-close'></i>
          </Button>
          </div>
        ]}
      >
        {availableDates.map((dateInfo, index) => (
          <p key={index}>
            {dateInfo.isAvailable ? new Date(dateInfo.date).toLocaleDateString() : 'Not Available'}
          </p>
        ))}
      </Modal>
    </Layout>
  );
};

export default BookingPage;
