    import React from 'react';
    import Layout from '../components/Layout';
    import axios from 'axios';
    import { message, Form, Input, Select, Rate } from 'antd';
    import { useDispatch, useSelector } from 'react-redux';
    import { showLoading, hideLoading } from '../redux/features/alertSlice';
    import { useNavigate } from 'react-router-dom';

    const { Option } = Select;

    const CreateFeedback = () => {
        const { user } = useSelector((state) => state.user);
        const dispatch = useDispatch();
        const navigate = useNavigate();

        const [form] = Form.useForm();

        const handleSubmit = async (values) => {
            try {
                dispatch(showLoading());
                const res = await axios.post('/api/v1/user/create-feedback', {
                    ...values,
                    userId: user._id,
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
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
      <div className="container2">
        <h2 className='text-center text-2xl font-bold mt-2'>Create Feedback</h2>
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="m-4">
          <Form.Item label="Category" name="category" required rules={[{ required: true }]}>
            <Select placeholder="Select a category">
              <Option value="Vaccination">Vaccination</Option>
              <Option value="Medication">Medication</Option>
              <Option value="Check-up">Check-up</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Feedback" name="feedback" required rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Enter your feedback here" />
          </Form.Item>
          <Form.Item
            label="Ratings"
            name="ratings"
            required
            rules={[
              { required: true, message: 'Please enter ratings' },
              {
                validator: async (_, value) => {
                  if (value >= 1 && value <= 5) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Ratings must be between 1 and 5');
                },
              },
            ]}
          >
            <Rate allowHalf defaultValue={2.5} />
          </Form.Item>


          <div className='flex justify-center'>
            <button className='bg-primary text-white px-6 py-2 form-btn mt-2' type="submit">
              Submit Feedback
            </button>
          </div>
        </Form>
      </div>
            </Layout>
        );
    };

    export default CreateFeedback;
