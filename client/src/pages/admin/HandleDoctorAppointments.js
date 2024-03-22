// HandleDoctorAppointments.js
import React, { useState, useEffect } from 'react';
import Layout from './../../components/Layout';
import axios from 'axios';
import moment from 'moment';
import { Table, message } from 'antd';

const HandleDoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    const getAppointments = async () => {
        try {
            const res = await axios.get('/api/v1/admin/handleDoctor-appointments', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (res.data.success) {
                setAppointments(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAppointments();
    }, []);

    const handleStatus = async (record, status) => {
        try {
            let reason = '';

            if (status === 'Rejected') {
                reason = prompt('Enter the reason for rejection:'); // Use prompt to get the reason from the doctor
            }

            const res = await axios.post('/api/v1/admin/update-appointment-status', {
                appointmentId: record._id,
                status: status, // Ensure the status is assigned correctly
                reason,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.data.success) {
                message.success(res.data.message);
                getAppointments();
            }
        } catch (error) {
            console.log(error);
            message.error('Something Went Wrong');
        }
    };

    const columns = [
        {
            title: 'Date and Time',
            dataIndex: 'date',
            render: (text, record) => (
                <span>
                    {moment(record.date).format('YYYY-MM-DD')} &nbsp;
                    {moment(record.time).format('hh:mm A')}
                </span>
            ),
        },
        {
            title: 'Service Type',
            dataIndex: 'serviceType',
            render: (text, record) => (
                <span>{record.serviceType.join(', ')}</span>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className='d-flex'>
                    {record.status === 'Pending' && (
                        <div className='d-flex w-full'>
                            <button className='bg-success w-50 rounded-lg text-white py-2 mr-2' onClick={() => handleStatus(record, 'Approved')}>Approve <i className='pl-2 fa fa-check'></i></button>
                            <button className='bg-danger w-50 rounded-lg text-white py-2' disabled>Reject <i className='pl-2 fa fa-close'></i> </button>
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <div style={{ backgroundColor: '#E8F4FE' }}>
                <h1 className='mt-24 font-bold text-3xl text-center'><span className='text-primary'>Appointment</span> <span className='text-warning'>Lists</span></h1>
                <Table className='mr-20 ml-20' columns={columns} dataSource={appointments} />
            </div>
        </Layout>
    );
};

export default HandleDoctorAppointments;
