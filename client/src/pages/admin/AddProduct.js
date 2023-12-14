import React, { useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { message, Form, Input, Select, Upload, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const AddProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form] = Form.useForm();

    const [image, setImage] = useState(null);

    const handleImageUpload = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            setImage(info.file.response.imagePath); // Use the relative path
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const handleSubmit = async (values) => {
        try {
            dispatch(showLoading());

            // Update the values with the image path
            values.productImage = image;

            // Your axios post request here
            const res = await axios.post('/api/v1/admin/add-product', values, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            dispatch(hideLoading());

            if (res.data.success) {
                message.success(res.data.message);
                navigate('/admin/inventory');
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
       
        <Layout title="Dashboard - Create Product" style={{ margin: 0, padding: 0 }}>
             <div style={{ backgroundColor: '#E8F4FE', minHeight: '100vh', padding: '1px'}}>
            <h1 className='text-center text-3xl font-bold mt-24 mb-4'><span class='text-primary'>Create</span> <span class='text-secondary'>Product</span></h1>
            <Button type="primary" className='btn bg-primary p-1 w-24 text-white ml-60' onClick={goBack} style={{ marginBottom: '16px' }}>
            <i class="pb-5 pr-1 fa fa-angle-left"></i> Back 
            </Button>
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="ml-80 mr-80 mt-3">
                <Form.Item label="Product Category" name="productCategory" required rules={[{ required: true }]}>
                    <Select placeholder="Select a category">
                        <Option value="Vaccination">Vaccination</Option>
                        <Option value="Medication">Medication</Option>
                        <Option value="Check-up">Check-up</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Product Name" name="productName" required rules={[{ required: true }]}>
                    <Input placeholder="Product Name" />
                </Form.Item>
                <Form.Item label="Product Description" name="productDescription" required rules={[{ required: true }]}>
                    <TextArea rows={4} placeholder="Product Description" />
                </Form.Item>
                <Form.Item label="Product Price" name="productPrice" required rules={[{ required: true }]}>
                    <Input type="number" placeholder="Product Price" />
                </Form.Item>
                <Form.Item label="Product Quantity" name="productQuantity" required rules={[{ required: true }]}>
                    <Input type="number" placeholder="Product Quantity" />
                </Form.Item>

                <Form.Item label="Product Photo" name="productImage">
                    <Upload
                        action="/api/v1/admin/upload-product-image" // Set the endpoint to handle image upload
                        name="productImage"
                        listType="picture"
                        showUploadList={false}
                        onChange={handleImageUpload}
                    >
                        {image ? (
                            <img src={`/${image}`} alt="Product" style={{ maxWidth: '50px' }} />
                        ) : (
                            <Button>Click to upload</Button>
                        )}
                    </Upload>
                </Form.Item>

                <div className="d-flex justify-content-center">
                    <button className="btn bg-primary form-btn text-white mb-5" type="submit">
                        Create Product
                    </button>
                </div>
            </Form>
            </div>
        </Layout>
    );
};

export default AddProduct;
