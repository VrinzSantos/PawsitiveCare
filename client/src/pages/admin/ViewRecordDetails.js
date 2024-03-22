import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Input, Button } from 'antd';

const ViewRecordDetails = () => {
  const navigate = useNavigate();
  const { recordData } = useLocation().state;
  const [historyData, setHistoryData] = useState([]);
  const [medicationData, setMedicationData] = useState([]);
  const [newHistory, setNewHistory] = useState('');
  const [newHistoryDate, setNewHistoryDate] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newMedicationDate, setNewMedicationDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (recordData) {
        try {
          const res = await axios.get(`/api/v1/admin/view-record-details/${recordData._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (res.data.success) {
            const { petsHistory, historyDate, petsMedication, medicationDate } = res.data.data;

            // Filter out empty strings or other undesired values
            const filteredPetsHistory = petsHistory.filter((item) => item.trim() !== '');
            const filteredPetsMedication = petsMedication.filter((item) => item.trim() !== '');

            // Map the data to the required structure with actual or default date values
            const historyData = filteredPetsHistory.map((item, index) => ({
              historyDate: historyDate[index] || new Date().toLocaleDateString(),  // Use the actual or default date value
              petsHistory: item,
            }));

            const medicationData = filteredPetsMedication.map((item, index) => ({
              medicationDate: medicationDate[index] || new Date().toLocaleDateString(),  // Use the actual or default date value
              petsMedication: item,
            }));

            setHistoryData(historyData);
            setMedicationData(medicationData);
          } else {
            console.error('Failed to fetch record details:', res.data.message);
          }
        } catch (error) {
          console.error('An error occurred while fetching record details:', error);
        }
      }
    };

    fetchData();
  }, [recordData]);

  const handleNavigateToFullDetails = () => {
    navigate(`/admin/view-full-details/${recordData._id}`);
  };

  const handleAddHistory = async () => {
    try {
      if (!newHistory || !newHistoryDate) {
        console.error('Please fill in both history and date fields');
        return;
      }
  
      const res = await axios.post(
        `/api/v1/admin/add-history/${recordData._id}`,
        {
          historyDate: newHistoryDate,
          petsHistory: newHistory,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      if (res.data.success) {
        const updatedHistoryData = [...historyData, { historyDate: newHistoryDate, petsHistory: newHistory }];
        setHistoryData(updatedHistoryData);
        setNewHistory('');
        setNewHistoryDate('');
      } else {
        console.error('Failed to add history entry:', res.data.message);
      }
    } catch (error) {
      console.error('An error occurred while adding history entry:', error);
    }
  };
  
  const handleAddMedication = async () => {
    try {
      if (!newMedication || !newMedicationDate) {
        console.error('Please fill in both medication and date fields');
        return;
      }
  
      const res = await axios.post(
        `/api/v1/admin/add-medication/${recordData._id}`,
        {
          medicationDate: newMedicationDate,
          petsMedication: newMedication,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      if (res.data.success) {
        const updatedMedicationData = [...medicationData, { medicationDate: newMedicationDate, petsMedication: newMedication }];
        setMedicationData(updatedMedicationData);
        setNewMedication('');
        setNewMedicationDate('');
      } else {
        console.error('Failed to add medication entry:', res.data.message);
      }
    } catch (error) {
      console.error('An error occurred while adding medication entry:', error);
    }
  };

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

  const renderLatestEntries = (data, columns) => {
    const latestEntries = data.slice(-5); // Get the latest 5 entries

    return (
      <Table dataSource={latestEntries} columns={columns} pagination={false} />
    );
  };

  return (
    <Layout style={{ margin: 0, padding: 0 }}>
    <div style={{ backgroundColor: '#E8F4FE', minHeight: '100vh', padding: '1px' }}>
      <h1 className='mt-24 mb-2 px-2 text-3xl text-center font-bold ml-10'><span class='text-warning'>View</span> <span class='text-primary'>Pet</span> <span class='text-secondary'>Owners</span> <span className='text-primary'>Records</span> </h1>

      <Button type="primary" className='btn bg-primary py-1 w-24 text-white ml-20' onClick={goBack} style={{ marginBottom: '16px' }}>
      <i class="pr-1 fa-solid fa-angle-left"></i> Back 
      </Button>

      <div className='px-20'>
      <h2 className='text-2xl font-bold mb-2'>Pets History</h2>
      <Table dataSource={historyData} columns={historyColumns} pagination={false} />

      <h2 className='mt-3 text-2xl font-bold mb-2'>Pets Medication</h2>
      <Table dataSource={medicationData} columns={medicationColumns} pagination={false} />
      </div>


      
        <h2 className='text-center mt-5 mb-2 text-2xl font-bold'>Add Entry</h2>
        
      
        <div className='flex justify-center'>
      <form className='flex w-full max-w-3xl p-5 mx-auto mb-5 rounded-2xl form-container' style={{ backgroundColor: '#fff', }}> 
          <div className='flex w-full max-w-3xl mx-auto'>
          <div className='w-full'>

        <div className='d-flex flex-column max-w-screen-lg sm:w-96 w-full'>
          <Input.TextArea
            placeholder="Pets History"
            value={newHistory}
            onChange={(e) => setNewHistory(e.target.value)}
          />
          <input
            type="date"
            className='w-full mt-2 p-1'
            value={newHistoryDate}
            onChange={(e) => setNewHistoryDate(e.target.value)}
            title="Select a date"
          />
          <Button style={{ backgroundColor: '#4a1e8a', color: '#fff' }} className='mt-2 mb-5' type="primary" onClick={handleAddHistory}>
            Add History
          </Button>
        </div>
        
        
        <div className='d-flex flex-column max-w-screen-2xl sm:w-96 w-full'>
          <Input.TextArea
            placeholder="Pets Medication"
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            className='mt-2 w-100'
          />
          <input
            type="date"
            value={newMedicationDate}
            onChange={(e) => setNewMedicationDate(e.target.value)}
            className='mt-2 p-1'
          />
          <Button style={{ backgroundColor: '#4a1e8a', color: '#fff' }} className='mt-2 mb-5' type="primary" onClick={handleAddMedication}>
            Add Medication
          </Button>

        <div className='flex justify-center'>
          <Button
            type="primary"
            className='btn bg-primary form-btn px-2 w-24 py-1 text-white '
            onClick={handleNavigateToFullDetails}
            style={{ marginBottom: '16px' }}
          >
            View Full Details
          </Button>
          </div>
        </div>
      </div>
      </div>
      </form>
      </div>
      </div>
    </Layout>
  );
};

export default ViewRecordDetails;
