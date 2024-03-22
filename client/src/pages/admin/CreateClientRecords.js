import React from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { message, Form, Input, Select, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import { useNavigate } from 'react-router-dom';



const CreateClientRecords = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            dispatch(showLoading());

            // Your axios post request here
            const res = await axios.post('/api/v1/admin/create-client-records', values, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            dispatch(hideLoading());

            if (res.data.success) {
                message.success(res.data.message);
                navigate('/admin/client-records'); // Adjust the redirection path as needed
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.error(error);
            message.error('Something went wrong');
        }
    };
    const goBack = () => {
        navigate(-1); 
      };


    return (
        <Layout title="Dashboard - Create Client Records" style={{ margin: 0, padding: 0 }}>
            <div style={{ backgroundColor: '#E8F4FE', minHeight: '100vh', padding: '1px' }}>
            <h1 className='text-center text-3xl font-bold mt-24 mb-4'><span class='text-primary'>Create</span> <span class='text-secondary'>Client</span>  <span class='text-warning'>Records</span></h1>
            <Button type="primary" className='btn bg-primary py-1 w-24 text-white ml-60' onClick={goBack} style={{ marginBottom: '16px' }}>
            <i class="pr-1 fa fa-angle-left"></i> Back 
            </Button>
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="ml-80 mr-80">
                <Form.Item label="Full Name" name="fullName" required rules={[{ required: true }]}>
                    <Input placeholder="Full Name" />
                </Form.Item>
                <Form.Item label="Address" name="address" required rules={[{ required: true }]}>
                    <Input.TextArea placeholder="Address" />
                </Form.Item>
                <Form.Item label="Contact" name="contact" required rules={[{ required: true }]}>
                    <Input placeholder="Contact" />
                </Form.Item>
                <Form.Item label="Name of Pet" name="nameOfPet" required rules={[{ required: true }]}>
                    <Input placeholder="Name of Pet" />
                </Form.Item>
                <Form.Item label="Species" name="species" required rules={[{ required: true }]}>
                    <Select placeholder="Select Species">
                        <Select.Option value="Dog">Dog</Select.Option>
                        <Select.Option value="Cat">Cat</Select.Option>
                        <Select.Option value="Bird">Bird</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Pet's Breed" name="petsBreed" required rules={[{ required: true }]}>
                    <Input placeholder="Pet's Breed" />
                </Form.Item>
                <Form.Item label="Pet's Sex" name="petsSex" required rules={[{ required: true }]}>
                    <Select placeholder="Select Sex">
                        <Select.Option value="Male">Male</Select.Option>
                        <Select.Option value="Female">Female</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Pet's Birthdate" name="petsBirthdate" required rules={[{ required: true }]}>
                <input className='p-2' type="date" placeholder="Select Pets Birthdate" style={{ width: '100%' }} />
                </Form.Item>
                <div className="d-flex justify-content-center">
                    <button style={{ backgroundColor: '#4a1e8a', color: '#fff' }} className="pt-2 pb-2 rounded-lg form-btn mb-5" type="submit">
                        Create Client Records
                    </button>
                </div>
            </Form>
            </div>
        </Layout>
    );
};

export default CreateClientRecords;
