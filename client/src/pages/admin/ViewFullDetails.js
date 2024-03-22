import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button } from 'antd';

const ViewFullDetails = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [recordDetails, setRecordDetails] = useState({
    petsHistory: [],
    historyDate: [],
    petsMedication: [],
    medicationDate: [],
  });

  useEffect(() => {
    const fetchRecordDetails = async () => {
      try {
        const res = await axios.get(`/api/v1/admin/view-full-details/${recordId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (res.data.success) {
          setRecordDetails(res.data.data);
        } else {
          console.error('Failed to fetch record details:', res.data.message);
        }
      } catch (error) {
        console.error('An error occurred while fetching record details:', error);
      }
    };

    fetchRecordDetails();
  }, [recordId]);

  const historyColumns = [
    {
      title: 'Pets History',
      dataIndex: 'petsHistory',
      key: 'petsHistory',
    },
    {
      title: 'Date of History',
      dataIndex: 'historyDate',
      key: 'historyDate',
    },
  ];

  const medicationColumns = [
    {
      title: 'Pets Medication',
      dataIndex: 'petsMedication',
      key: 'petsMedication',
    },
    {
      title: 'Date of Medication',
      dataIndex: 'medicationDate',
      key: 'medicationDate',
    },
  ];

  const goBack = () => {
    navigate(-1);
  };


  return (
    <Layout style={{ margin: 0, padding: 0 }}>
    <div style={{ backgroundColor: '#E8F4FE', minHeight: '100vh', padding: '1px' }}>
      <h1 className='mt-24 mb-2 px-2 text-3xl text-center font-bold ml-10'><span className='text-secondary'>View</span> <span className='text-warning'>Full</span> <span className='text-primary'>Details</span></h1>
      <Button type="primary" className='btn bg-primary p-1 w-24 text-white ml-20' onClick={goBack} style={{ marginBottom: '16px' }}>
        <i className="pr-2 fa fa-angle-left"></i> Back
      </Button>

      {/* Display Pets History */}
      <div className='px-20'>
      <h2 className='text-2xl font-bold'>Pets History</h2>
      <Table dataSource={recordDetails.petsHistory.map((petsHistory, index) => ({ petsHistory, historyDate: recordDetails.historyDate[index] }))} columns={historyColumns} pagination={false} />
      
      {/* Display Pets Medication */}
      <h2 className='mt-3 text-2xl font-bold'>Pets Medication</h2>
      <Table className='mb-20' dataSource={recordDetails.petsMedication.map((petsMedication, index) => ({ petsMedication, medicationDate: recordDetails.medicationDate[index] }))} columns={medicationColumns} pagination={false} />
      </div>
      </div>
    </Layout>
  );
};

export default ViewFullDetails;
