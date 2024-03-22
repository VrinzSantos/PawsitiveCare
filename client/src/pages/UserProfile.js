import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, message } from 'antd';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    // Update user profile
    const handleFinish = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/updateProfile', { ...values, userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                // Optionally, you can update the profile state with the new profile data
                setProfile({ ...profile, ...values });
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error('Something went wrong');
        }
    };

    // Get user profile details
    const getUserInfo = async () => {
        try {
            const res = await axios.post('/api/v1/user/getUserInfo', { userId: user._id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (res.data.success) {
                setProfile(res.data.data);
                console.log('User data retrieved successfully:', res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Change user password
    const handleChangePassword = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post('/api/v1/user/change-password', {
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
                navigate('/login'); // Redirect to the login page after changing the password
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
        getUserInfo();
        // eslint-disable-next-line
    }, []);

    return (
        <Layout>
          <div className="form1">
          {profile && (
            <div className="space-y-3">
              {/* Update Profile Form */}
              <Form
                layout="vertical"
                onFinish={handleFinish}
                className="space-y-2"
                initialValues={profile}
              >
                <h2 className="text-lg font-bold mb-4">Update Profile:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
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
                  <button className="btn bg-primary form-btn text-white" type="submit">
                    Update
                  </button>
                </div>
              </Form>
      
              {/* Change Password Form */}
              <Form
                layout="vertical"
                onFinish={handleChangePassword}
                className="space-y-1"
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
                  <button className="btn bg-primary form-btn text-white" type="submit">
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

export default UserProfile;
