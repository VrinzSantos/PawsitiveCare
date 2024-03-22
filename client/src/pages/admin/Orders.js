// Orders.js
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Table, Button, message, DatePicker, Modal } from 'antd';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [dateFilter, setDateFilter] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    const getOrders = useCallback(async () => {
        try {
            const response = await axios.get('/api/v1/admin/view-order', {
                params: { date: dateFilter },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.data.success) {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, [dateFilter]);

    const handleDateChange = (date) => {
        setDateFilter(date ? date.toISOString().split('T')[0] : null);
    };

    const deleteOrder = async (orderId) => {
        try {
            const res = await axios.delete(`/api/v1/admin/delete-order/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.data.success) {
                message.success('Order deleted successfully');
            } else {
                message.error('Failed to delete the order');
            }
        } catch (error) {
            console.error('An error occurred while deleting the product:', error);
            message.error('An error occurred while deleting the product');
        }
    };

    const handleDeleteOrder = (order) => {
        showDeleteModal(order);
    };

    const showDeleteModal = (order) => {
        setOrderToDelete(order);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteModalCancel = () => {
        setOrderToDelete(null);
        setIsDeleteModalVisible(false);
    };

    const handleDeleteModalConfirm = () => {
        if (orderToDelete) {
            deleteOrder(orderToDelete._id);
            getOrders(); // Refresh the list after deletion
            setOrderToDelete(null);
        }

        setIsDeleteModalVisible(false);
    };

    useEffect(() => {
        getOrders();
    }, [getOrders]);

    const columns = [
        {
            title: 'Order Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
        },
        {
            title: 'Amount Received',
            dataIndex: 'amountReceived',
            key: 'amountReceived',
        },
        {
            title: 'Change',
            dataIndex: 'change',
            key: 'change',
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <div>
                    <Button className='btn bg-danger text-white p-1 m-0 px-2' onClick={() => handleDeleteOrder(record)}>Delete <i class="pl-2 fa fa-trash"></i></Button>
                </div>
            ),
        },
    ];

    return (
        <Layout style={{ margin: 0, padding: 0 }}>
            <div style={{ backgroundColor: '#E8F4FE', minHeight: '100vh', padding: '1px' }}>
            <h1 className='mt-24 mb-2 font-bold text-center text-3xl text-primary'>Orders</h1>
            <DatePicker className='w-50 ml-20 mb-2' onChange={handleDateChange} />
            <Table className='ml-10 mr-10' columns={columns} dataSource={orders} />
            {/* Delete Confirmation Modal */}
            </div>    
            <Modal
                title="Confirm Deletion"
                visible={isDeleteModalVisible}
                onCancel={handleDeleteModalCancel}
                okText="Delete"
                cancelText="Cancel"
                footer={[
                    <div className='flex justify-center'>
                    <Button key="delete" className='btn bg-danger text-white mr-4' type="primary" onClick={handleDeleteModalConfirm}>
                        Delete <i class="pl-2 fa fa-trash"></i>
                    </Button>
                    <Button key="cancel" className='btn bg-warning m-0 text-white ' onClick={handleDeleteModalCancel}>
                        Cancel <i class="pl-2 fa fa-close"></i>
                    </Button>
                    </div>
                ]}
            >
                Are you sure you want to delete this product?
            </Modal>
        </Layout>
    );
};

export default Orders;
