import React, { useState, useEffect } from 'react';
import Layout from './../../components/Layout';
import axios from 'axios';
import moment from 'moment';
import { Table } from 'antd';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    const getAppointments = async () => {
        try {
            const res = await axios.get('/api/v1/doctor/doctor-appointments', {
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
    ];

    return (
        <Layout>
            <div style={{ backgroundColor: '#E8F4FE' }}>
                <h1 className='mt-24 font-bold text-3xl text-center'>
                    <span class='text-primary'>Appointment</span>{' '}
                    <span class='text-warning'>Lists</span>
                </h1>
                <Table
                    className='mr-20 ml-20'
                    columns={columns}
                    dataSource={appointments}
                />
            </div>
        </Layout>
    );
};

export default DoctorAppointments;