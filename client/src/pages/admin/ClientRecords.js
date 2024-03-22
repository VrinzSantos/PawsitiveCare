import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Table, Button, Modal, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const ClientRecords = () => {
    const [clientRecords, setClientRecords] = useState([]);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const fetchClientRecords = useCallback(async () => {
        try {
            const res = await axios.get('/api/v1/admin/view-client-records', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.data.success) {
                setClientRecords(res.data.data);
            }
        } catch (error) {
            console.error('An error occurred while fetching client records:', error);
        }
    }, []);

    useEffect(() => {
        fetchClientRecords();
    }, [fetchClientRecords]);

    const handleEditRecord = (record) => {
        navigate(`/admin/edit-client-records/${record._id}`, {
            state: { recordData: record },
        });
    };

    const handleRecordDetails = (record) => {
        navigate(`/admin/view-record-details/${record._id}`, {
            state: { recordData: record },
        });
    };

    const showDeleteModal = (record) => {
        setRecordToDelete(record);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteModalCancel = () => {
        setRecordToDelete(null);
        setIsDeleteModalVisible(false);
    };

    const handleDeleteModalConfirm = async () => {
        if (recordToDelete) {
            await deleteRecord(recordToDelete._id);
            await fetchClientRecords();
            setRecordToDelete(null);
        }

        setIsDeleteModalVisible(false);
    };

    const deleteRecord = async (recordId) => {
        try {
            const res = await axios.delete(`/api/v1/admin/delete-client-records/${recordId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.data.success) {
                message.success('Client record deleted successfully');
            } else {
                message.error('Failed to delete the client record');
            }
        } catch (error) {
            console.error('An error occurred while deleting the client record:', error);
            message.error('An error occurred while deleting the client record');
        }
    };

    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Contact',
            dataIndex: 'contact',
            key: 'contact',
        },
        {
            title: 'Name of Pet',
            dataIndex: 'nameOfPet',
            key: 'nameOfPet',
        },
        {
            title: 'Species',
            dataIndex: 'species',
            key: 'species',
        },
        {
            title: 'Pets Breed',
            dataIndex: 'petsBreed',
            key: 'petsBreed',
        },
        {
            title: 'Pets Sex',
            dataIndex: 'petsSex',
            key: 'petsSex',
        },
        {
            title: 'Pets Birthdate',
            dataIndex: 'petsBirthdate',
            key: 'petsBirthdate',
            render: (birthdate) => new Date(birthdate).toLocaleDateString('en-CA'),
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <div className='d-flex justify-center'>
                    <Button className='btn bg-primary text-white w-50 py-1' onClick={() => handleEditRecord(record)}>
                        Edit <i className="pl-2 fa fa-edit"></i>
                    </Button>
                    <Button className='btn bg-secondary ml-1 text-white w-50 py-1' onClick={() => handleRecordDetails(record)}>
                        View <i className="pl-2 fa fa-eye"></i>
                    </Button>
                    <Button className='btn bg-danger ml-1 text-white w-50 py-1' onClick={() => showDeleteModal(record)}>
                        Delete <i className="pl-2 fa fa-trash"></i>
                    </Button>
                </div>
            ),
        },
    ];

    // Filter records based on the search query
    const filteredClientRecords = clientRecords.filter((record) =>
        record.nameOfPet.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Use the filtered records when searchQuery is not empty
    const displayedRecords = searchQuery ? filteredClientRecords : clientRecords;

    return (
        <Layout style={{ margin: 0, padding: 0 }}>
            <div style={{ backgroundColor: '#E8F4FE', minHeight: '100vh', padding: '1px' }}>
                <h1 className='mt-24 text-3xl font-bold ml-10 mb-3 text-center'>
                    <span className='text-secondary'>Pet</span> <span className='text-primary'>Owners</span>{' '}
                    <span className='text-warning'>Records</span>
                </h1>
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search by Name of Pet"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => setSearchQuery('')}>Clear</button>
                <Link className='button-link mb-2 text-white ml-10' to="/admin/create-client-records">
                    Add Client Record
                </Link>
                <Table className='ml-10 mr-10' columns={columns} dataSource={displayedRecords} />

                {/* Delete Confirmation Modal */}
                <Modal
                    title="Confirm Deletion"
                    visible={isDeleteModalVisible}
                    onCancel={handleDeleteModalCancel}
                    footer={[
                        <div className="flex justify-center space-x-4">
                            <Button key="delete" className='btn bg-danger text-white' type="primary" onClick={handleDeleteModalConfirm}>
                                Delete <i className="pl-2 fa fa-trash"></i>
                            </Button>
                            <Button key="cancel" className='btn bg-warning text-white' onClick={handleDeleteModalCancel}>
                                Cancel <i className="pl-2 fa fa-close"></i>
                            </Button>
                        </div>
                    ]}
                >
                    Are you sure you want to delete this record?
                </Modal>
            </div>
        </Layout>
    );
};

export default ClientRecords;
