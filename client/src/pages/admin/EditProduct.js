import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { message, Form, Input, Select, Upload, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const EditProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { productId } = useParams();

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
            values.productImage = image; // Update the values with the image path

            const res = await axios.put(`/api/v1/admin/edit-product/${productId}`, values, {
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

    useEffect(() => {
        // Fetch product details by productId and set the form values
        async function fetchProductDetails() {
            try {
                const res = await axios.get(`/api/v1/admin/get-product/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (res.data.success) {
                    const product = res.data.data;
                    // Set initial form values, including productImage
                    form.setFieldsValue({
                        ...product,
                        productImage: product.productImage,
                    });
                    setImage(product.productImage);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchProductDetails();
    }, [form, productId]);

    const goBack = () => {
        navigate(-1); 
    };

    return (
        <div style={{ backgroundColor: '#E8F4FE'}}>
        <Layout title="Dashboard - Edit Product">
            <h1 className='mt-24 text-3xl font-bold text-center mb-3'><span class='text-warning'>Edit</span> <span class='text-secondary'>Product</span></h1>

            <Button type="primary" className='btn bg-primary py-1 w-24 text-white ml-80' onClick={goBack} style={{ marginBottom: '16px' }}>
            <i class="pr-2 fa fa-angle-left"></i> Back 
            </Button>

            <Form form={form} layout="vertical" onFinish={handleSubmit} className="flex justify-center">
            <div className='w-50'>
                <Form.Item label="Product Category" name="productCategory">
                    <Select placeholder="Select a category">
                        <Option value="Vaccination">Vaccination</Option>
                        <Option value="Medication">Medication</Option>
                        <Option value="Check-up">Check-up</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Product Name" name="productName" >
                    <Input placeholder="Product Name" />
                </Form.Item>
                <Form.Item label="Product Description" name="productDescription" >
                    <TextArea rows={4} placeholder="Product Description" />
                </Form.Item>
                <Form.Item label="Product Price" name="productPrice" >
                    <Input type="number" placeholder="Product Price" />
                </Form.Item>
                <Form.Item label="Product Quantity" name="productQuantity" >
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

                <div className="d-flex justify-content-center mb-5">
                    <button style={{ backgroundColor: '#4a1e8a', color: '#fff' }}
                     className="py-1 rounded-lg form-btn" type="submit">
                        Update Product
                    </button>
                </div>
                </div>
            </Form>
        </Layout>
        </div>
    );
};

export default EditProduct;
