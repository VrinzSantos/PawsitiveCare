import React, { useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { message, Form, Input, Select, Button} from 'antd';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import { useNavigate, useParams } from 'react-router-dom';


const EditClientRecords = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { recordId } = useParams();

    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            dispatch(showLoading());

            const res = await axios.put(`/api/v1/admin/edit-client-records/${recordId}`, values, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            dispatch(hideLoading());

            if (res.data.success) {
                message.success(res.data.message);
                navigate('/admin/client-records');
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.error(error);
            message.error('Something went wrong');
        }
    };

    useEffect(() => {
        // Fetch existing client records data by recordId and set the form values
        async function fetchClientRecordsDetails() {
            try {
                const res = await axios.get(`/api/v1/admin/get-client-records/${recordId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (res.data.success) {
                    const clientData = res.data.data;
                    form.setFieldsValue(clientData);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchClientRecordsDetails();
    }, [form, recordId]);

    const goBack = () => {
        navigate(-1); 
      };

    return (

        <Layout title="Dashboard - Edit Client Records" style={{ margin: 0, padding: 0 }}>
            <div style={{ backgroundColor: '#E8F4FE', minHeight: '100vh', padding: '1px'}}>
            <h1 className='mt-24 font-bold text-3xl text-center'><span className='text-warning'>Edit</span> <span className='text-primary'>Pet</span> <span className='text-secondary'>Owners</span> <span className='text-primary'>Records</span></h1>
            <Button type="primary" className='btn bg-primary px-2 w-24 text-white ml-60' onClick={goBack} style={{ marginBottom: '16px' }}>
            <i class="py-1 fa fa-angle-left"></i> Back 
            </Button>
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="ml-80 mr-80">
                {/* Add form fields here with corresponding Input/Select components */}
                <Form.Item label="Full Name" name="fullName" required>
                    <Input placeholder="Full Name" />
                </Form.Item>
                <Form.Item label="Address" name="address" required rules={[{ required: true }]}>
                    <Input placeholder="Address" />
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
                <input type="date" placeholder="Select Pets Birthdate" className='py-2 px-2 rounded' style={{ width: '100%' }} />
                </Form.Item>
                <div className="d-flex justify-content-center mb-5">
                    <button className="btn bg-primary form-btn text-white" type="submit">
                        Update Client Records
                    </button>
                </div>
            </Form>
            </div>
        </Layout>

    );
};

export default EditClientRecords;
