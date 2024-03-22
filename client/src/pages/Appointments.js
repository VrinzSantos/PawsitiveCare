import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import moment from 'moment';
import { Table, Modal, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  const getAppointments = async () => {
    try {
      const res = await axios.get('/api/v1/user/user-appointments', {
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

  const showDeleteModal = (appointment) => {
    setAppointmentToDelete(appointment);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteModalCancel = () => {
    setAppointmentToDelete(null);
    setIsDeleteModalVisible(false);
  };

  const handleDeleteModalConfirm = () => {
    if (appointmentToDelete) {
      deleteAppointment(appointmentToDelete._id);
      getAppointments(); // Refresh the list after deletion
      setAppointmentToDelete(null);
    }

    setIsDeleteModalVisible(false);
  };

  const handleEditAppointment = (appointment) => {
    navigate(`/edit-appointment/${appointment._id}`, {
      state: { appointmentData: appointment },
    });
  };

  const handleDeleteAppointment = (appointment) => {
    showDeleteModal(appointment);
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      const res = await axios.delete(`/api/v1/user/delete-appointment/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.success) {
        message.success('Appointment deleted successfully');
      } else {
        message.error('Failed to delete the appointment');
      }
    } catch (error) {
      console.error('An error occurred while deleting the appointment:', error);
      message.error('An error occurred while deleting the appointment');
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <span>{record.doctorInfo.name}</span>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      render: (text, record) => (
        <span>{record.doctorInfo.phone}</span>
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
        <div className='flex flex-col'>
          <Button className='bg-primary mt-2 mb-2' type='primary' onClick={() => handleEditAppointment(record)}>
            Edit <i className='pl-2 fa fa-edit'></i>
          </Button>
          <Button className='bg-warning mt-2 mb-2' type='primary' onClick={() => handleDeleteAppointment(record)}>
            Cancel <i className='pl-2 fa fa-close'></i>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ margin: 0, padding: 0 }}>
    <div style={{ backgroundColor: '#E8F4FE', minHeight: '100vh', padding: '1px' }}>
      <h1 className='mt-24 font-bold text-3xl text-center'><span className='text-primary'>Appointment</span> <span className='text-warning'>Lists</span></h1>
      <Table
        className='ml-10 mr-10 mt-3'
        columns={columns}
        dataSource={appointments}
        scroll={{ x: 'max-content' }}
        pagination={{ responsive: true }}
      />
    </div>
    <Modal
      className='text-lg' title="Confirm Deletion"
      visible={isDeleteModalVisible}
      onCancel={handleDeleteModalCancel}
      okText="Delete"
      cancelText="Cancel"
      footer={[
        <div className='flex justify-center'>
          <Button key="delete" className='bg-danger text-white mr-4 ' onClick={handleDeleteModalConfirm}>
            Delete <i className='pl-2 fa fa-trash'></i>
          </Button>
          <Button className="bg-warning text-white m-0" key="cancel" onClick={handleDeleteModalCancel}>
            Cancel <i className='pl-2 fa fa-close'></i>
          </Button>
        </div>
      ]}
    >
      Are you sure you want to delete this appointment?
    </Modal>
  </Layout>
  );
};

export default Appointments;
