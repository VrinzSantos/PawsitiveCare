import React, { useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { message, Form, Input, Select, Button } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Import useDispatch for Redux actions
import { showLoading, hideLoading } from '../redux/features/alertSlice'; // Import showLoading and hideLoading

const { Option } = Select;

const EditFeedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const feedbackData = location.state ? location.state.feedbackData : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch(); // Initialize dispatch

  const handleUpdateFeedback = async (values) => {
    try {
      setIsSubmitting(true);
      dispatch(showLoading()); // Show loading

      const updatedFeedback = {
        ...feedbackData,
        ...values,
      };

      const res = await axios.put(`/api/v1/user/edit-feedback/${feedbackData._id}`, updatedFeedback, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      dispatch(hideLoading());

                if (res.data.success) {
                    message.success(res.data.message);
                    navigate('/user/feedbacks');
                } else {
                    message.error(res.data.message);
                }
            } catch (error) {
                dispatch(hideLoading());
                console.error(error);
                message.error('Something went wrong');
            }
        };

  return (
    <Layout>
      <h1 className='mt-20'>Edit Feedback</h1>
      {feedbackData ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateFeedback}
          initialValues={feedbackData}
        >
          <Form.Item label="Category" name="category" required>
            <Select placeholder="Select a category">
              <Option value="Vaccination">Vaccination</Option>
              <Option value="Medication">Medication</Option>
              <Option value="Check-up">Check-up</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Feedback" name="feedback" required>
            <Input.TextArea rows={4} placeholder="Enter your feedback" />
          </Form.Item>
          <Form.Item label="Ratings" name="ratings" required rules={[
                    { required: true, message: 'Please enter ratings' },
                    {
                    validator: async (_, value) => {
                    if (value >= 1 && value <= 5) {
                        return Promise.resolve();
                            }
                        return Promise.reject('Ratings must be between 1 (lowest) and 5 (highest)');
                        },
                    },
                    ]}>
                    <Input type="number" placeholder="Ratings (e.g., 1 to 5)" />
                    </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Update Feedback
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <p>Loading feedback data...</p>
      )}
    </Layout>
  );
};

export default EditFeedback;
