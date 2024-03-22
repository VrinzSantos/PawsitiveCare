import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, message } from 'antd';
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
    const { user } = useSelector((state) => state.user);
    const [admin, setAdmin] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Update admin
    const handleFinish = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/admin/updateProfile', { ...values, userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                navigate('/');
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Something went wrong');
        }
    };

    // Get admin details
    const getAdminInfo = async () => {
        try {
            const res = await axios.post('/api/v1/admin/getAdminInfo', { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (res.data.success) {
                setAdmin(res.data.data);
                console.log('Admin data retrieved successfully:', res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangePassword = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/admin/change-password', {
                userId: user._id,
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                navigate('/login');
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Something went wrong');
        }
    };

    useEffect(() => {
        getAdminInfo();
        // eslint-disable-next-line
    }, []);

    return (
        <Layout>
           
          
          <div className="form">
          {admin && (
            <div className="space-y-3">
              {/* Update Profile Form */}
              <Form
                layout="vertical"
                onFinish={handleFinish}
                className="m-3 space-y-1"
                initialValues={admin}
              >
                <h2 className="text-lg font-bold mb-4">Update Profile:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Form.Item
                    label="Name"
                    name="name"
                    required
                    rules={[{ required: true, message: 'Name is required' }]}
                  >
                    <Input type="text" placeholder="Name" />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    required
                    rules={[{ required: true, message: 'Email is required' }]}
                  >
                    <Input type="text" placeholder="Email" />
                  </Form.Item>
                  {/* Add more fields as needed */}
                </div>
                <div className="flex justify-center">
                  <button className="bg-primary py-2 form-btn rounded-lg text-white" type="submit">
                    Update
                  </button>
                </div>
              </Form>
      
              {/* Change Password Form */}
              <Form
                layout="vertical"
                onFinish={handleChangePassword}
                className="m-5 space-y-1"
              >
                <h2 className="text-lg font-bold mb-4">Change Password:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Form.Item
                    label="Current Password"
                    name="currentPassword"
                    required
                    rules={[{ required: true, message: 'Current Password is required' }]}
                  >
                    <Input type="password" placeholder="Current Password" />
                  </Form.Item>
                  <Form.Item
                    label="New Password"
                    name="newPassword"
                    required
                    rules={[{ required: true, message: 'New Password is required' }]}
                  >
                    <Input type="password" placeholder="New Password" />
                  </Form.Item>
                </div>
                <div className="flex justify-center">
                  <button className="bg-primary py-2 form-btn rounded-lg text-white" type="submit">
                    Change Password
                  </button>
                </div>
              </Form>
            </div>
          )}
          </div>
        </Layout>
    );
};

export default AdminProfile;
