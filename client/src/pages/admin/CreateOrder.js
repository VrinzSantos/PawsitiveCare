// CreateOrder.js
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { message, Form, Select, Input, Button, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const CreateOrder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]); // All available products
    const [selectedProducts, setSelectedProducts] = useState([]); // Selected products
    const [searchInput, setSearchInput] = useState('');
    const [amountReceived, setAmountReceived] = useState(0);
    const [change, setChange] = useState(0);

    // Fetch product data from your server when the component loads
    useEffect(() => {
        axios.get('/api/v1/admin/inventory', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }).then((response) => {
            if (response.data.success) {
                setProducts(response.data.data);
            } else {
                message.error(response.data.message);
            }
        });
    }, []);

    const handleCategorySelect = (value) => {
        setSelectedCategory(value);
    };

    const handleQuantityChange = (productId, quantity) => {
        setSelectedProducts((prevSelectedProducts) =>
            prevSelectedProducts.map((p) =>
                p.product._id === productId
                    ? {
                          ...p,
                          quantity: Math.min(parseInt(quantity), p.product.stocksLeft),
                      }
                    : p
            )
        );
    };

    const handleAddToCart = (product) => {
        const productInCart = selectedProducts.find((p) => p.product._id === product._id);
        if (productInCart) {
            // If the product is already in the cart, update the quantity
            setSelectedProducts((prevSelectedProducts) =>
                prevSelectedProducts.map((p) =>
                    p.product._id === product._id
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                )
            );
        } else {
            // If the product is not in the cart, add it with a quantity of 1
            setSelectedProducts((prevSelectedProducts) => [
                ...prevSelectedProducts,
                {
                    product,
                    quantity: 1,
                },
            ]);
        }
    };

    const handleRemoveFromCart = (productId) => {
        setSelectedProducts((prevSelectedProducts) =>
            prevSelectedProducts.filter((p) => p.product._id !== productId)
        );
    };

    const calculateTotalAmount = () => {
        return selectedProducts.reduce(
            (total, product) => total + product.quantity * product.product.productPrice,
            0
        );
    };

    const handleAmountReceivedChange = (value) => {
        const amountReceivedValue = parseFloat(value);
        setAmountReceived(amountReceivedValue);

        // Calculate change
        const totalAmount = calculateTotalAmount();
        const changeValue = amountReceivedValue - totalAmount;
        setChange(changeValue < 0 ? 0 : changeValue);
    };

    const handleSubmit = async (values) => {
        try {
            dispatch(showLoading());

            

            // Your axios post request here
            const res = await axios.post(
                '/api/v1/admin/create-order',
                {
                    products: selectedProducts,
                    totalAmount: calculateTotalAmount(),
                    amountReceived: amountReceived,
                    change: change,
                    customerName: values.customerName, // Updated field name
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            dispatch(hideLoading());

            if (res.data.success) {
                message.success(res.data.message);
                // Optionally, you can redirect the user to a different page upon successful order creation
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

    const renderAvailableProducts = () => {
        const filteredProducts = selectedCategory
            ? products.filter((product) => product.productCategory === selectedCategory)
            : products;

        const availableProducts = filteredProducts
            .filter((product) => product.stocksLeft > 0)
            .filter((product) => product.productName.toLowerCase().includes(searchInput.toLowerCase()));

        return (
<div className="w-75 pr-4">
    <Row gutter={16}>
        {availableProducts.map((product) => (
            <Col span={6} key={product._id}>
                <div className="mb-4 p-4 border rounded-lg bg-white product-container" style={{ height: '90%' }}>
                    <img
                        src={`/${product.productImage}`}
                        alt={product.productName}
                        style={{
                            display: 'block',
                            margin: 'auto',
                            maxWidth: '60%',
                            maxHeight: '120px',
                            marginBottom: '8px',
                        }}
                    />
                    <p className="mb-2">Product Name: {product.productName}</p>
                    <p className="mb-2">Product Price: ₱{product.productPrice}</p>
                    <p className="mb-2">Stocks Left: {product.stocksLeft}</p>
                    <div className='flex justify-center'>
                    <Button
                        style={{ backgroundColor: '#4a1e8a', color: '#fff' }}
                        className="mt-3 w-50"
                        onClick={() => handleAddToCart(product)}>
                        Add
                    </Button>
                    </div>
                </div>
            </Col>
        ))}
    </Row>
</div>

        );
    };

    return (
        <Layout title="Dashboard - Create Order" style={{ margin: 0, padding: 0 }}>
            <div style={{ backgroundColor: '#E8F4FE', minHeight: '100vh', padding: '1px' }}>
            <h1 className="mt-24 text-3xl font-bold text-center"><span class='text-primary'>Create</span> <span class='text-secondary'>Order</span></h1>
            <Form form={form} layout="vertical" onFinish={handleSubmit} className="m-4">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Product Category" name="productCategory">
                            <Select
                                placeholder="Select a category"
                                onChange={handleCategorySelect}
                                style={{ width: '100%' }}
                            >
                                <Option value={null}>All</Option>
                                <Option value="Vaccination">Vaccination</Option>
                                <Option value="Medication">Medication</Option>
                                <Option value="Check-up">Check-up</Option>
                                {/* Add more categories if needed */}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Search Product" name="searchProduct">
                            <Input
                                placeholder="Search by product name"
                                onChange={(e) => setSearchInput(e.target.value)}
                                prefix={
                                      <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} /> 
                                  }
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Customer Name" name="customerName" required>
                            <Input placeholder="Enter customer name" />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="flex">
                    {renderAvailableProducts()}
                    <div className="w-25">
                        <div className="bg-gray-200 w-full border rounded mt-4">
                            <h2 className="text-lg font-bold text-center mt-2">Selected Products</h2>
                            <Row gutter={[16, 16]}>
                                {selectedProducts.map((selectedProduct) => (
                                    <Col span={12} key={selectedProduct.product._id}>
                                        <div className="mb-4 w-91 pl-2 pr-2 ml-2 mr-2 border rounded-lg bg-white">
                                            <img
                                            src={`/${selectedProduct.product.productImage}`}
                                            alt={selectedProduct.product.productName}
                                            style={{display: 'block', maxWidth: '100%', maxHeight: '120px', 
                                                    marginBottom: '8px',
                                                    margin: 'auto',
                                                    marginTop: '10px' }}
                                            />
                                            <p className="mb-2">Product: {selectedProduct.product.productName}</p>
                                            <p className="mb-2">Quantity: {selectedProduct.quantity}</p>
                                            <p className="mb-2">Price: ₱{selectedProduct.product.productPrice}</p>
                                            <Input
                                                type="number"
                                                placeholder="Quantity"
                                                value={selectedProduct.quantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(selectedProduct.product._id, e.target.value)
                                                }
                                            />

                                            <div className='text-center'>
                                            <Button
                                                type="danger"
                                                className="mt-3 py-1 text-white bg-danger px-4 mb-2"
                                                onClick={() => handleRemoveFromCart(selectedProduct.product._id)}
                                            >
                                                Remove
                                            </Button>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                            <Col span={15}>
                            <Form.Item className='ml-2' label={<span style={{ fontWeight: 'bold' }}>Amount Received</span>} name="amountReceived" required>
                                <Input
                                    className='ml-2'
                                    type="number"
                                    placeholder="Enter amount received"
                                    onChange={(e) => handleAmountReceivedChange(e.target.value)}
                                />
                            </Form.Item>
                    </Col>
                            <p className="font-semibold mt-4 ml-4 mb-1">Total Amount: ₱{calculateTotalAmount()}</p>
                            <p className="font-semibold ml-4 mb-5">Change: ₱{change.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-3">
                    <Button style={{ backgroundColor: '#4a1e8a', color: '#fff' }} className='btn mb-3 w-50 py-1'  htmlType="submit">
                        Checkout
                    </Button>
                </div>
            </Form>
            </div>
        </Layout>
    );
};

export default CreateOrder;
