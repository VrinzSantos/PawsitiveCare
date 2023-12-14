import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Table, Input } from 'antd';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Get users
    const getUsers = async () => {
        try {
            const res = await axios.get('/api/v1/admin/getAllUsers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    // AntD table columns
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Member',
            dataIndex: 'isMember',
            render: (text, record) => <span>{record.isMember ? 'Yes' : 'No'}</span>,
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className='d-flex'>
                    <button className='btn btn-danger w-50'>Block <i className="pl-2 fa fa-ban"></i></button>
                </div>
            ),
        },
    ];

    // Filter users based on the search query
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout style={{ margin: 0, padding: 0 }}>
            <div style={{ backgroundColor: '#E8F4FE', minHeight: '100vh', padding: '1px' }}>
                <h1 className='text-center text-3xl font-bold mt-24 mb-4'>
                    <span className='text-warning'>Guests</span> <span className='text-primary'>List</span>
                </h1>
                {/* Search Input */}
                <Input
                    placeholder="Search by Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginBottom: '16px' }}
                />
                <Table className='ml-10 mr-10 mt-3' columns={columns} dataSource={filteredUsers} />
            </div>
        </Layout>
    );
};

export default Users;
