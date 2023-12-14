import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Table, Button, Modal, message, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const getProducts = useCallback(async () => {
        try {
            const res = await axios.get('/api/v1/admin/inventory', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (res.data.success) {
                // Filter products based on the search query
                const filteredProducts = res.data.data.filter(product => {
                    return product.productName.toLowerCase().includes(searchQuery.toLowerCase());
                });
                setProducts(filteredProducts);
            }
        } catch (error) {
            console.log(error);
        }
    }, [searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const searchProduct = async () => {
        try {
            const res = await axios.get('/api/v1/admin/search-product', {
                params: { searchQuery },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.data.success) {
                setProducts([res.data.data]);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('An error occurred while searching for the product:', error);
            message.error('An error occurred while searching for the product');
        }
    };

    const showDeleteModal = (product) => {
        setProductToDelete(product);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteModalCancel = () => {
        setProductToDelete(null);
        setIsDeleteModalVisible(false);
    };

    const handleDeleteModalConfirm = () => {
        if (productToDelete) {
            deleteProduct(productToDelete._id);
            getProducts(); // Refresh the list after deletion
            setProductToDelete(null);
        }

        setIsDeleteModalVisible(false);
    };

    const handleEditProduct = (product) => {
        navigate(`/admin/edit-product/${product._id}`, {
            state: { productData: product },
        });
    };

    const handleDeleteProduct = (product) => {
        showDeleteModal(product);
    };

    const deleteProduct = async (productId) => {
        try {
            const res = await axios.delete(`/api/v1/admin/delete-product/${productId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (res.data.success) {
                message.success('Product deleted successfully');
            } else {
                message.error('Failed to delete the product');
            }
        } catch (error) {
            console.error('An error occurred while deleting the product:', error);
            message.error('An error occurred while deleting the product');
        }
    };

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    const columns = [
        {
            title: 'Product Photo',
            dataIndex: 'productImage',
            key: 'productImage',
            render: (image) => (
                <img src={`/${image}`} alt="Product" style={{ maxWidth: '80px' }} />
            ),
        },
        {
            title: 'Category',
            dataIndex: 'productCategory',
            key: 'productCategory',
        },
        {
            title: 'Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Description',
            dataIndex: 'productDescription',
            key: 'productDescription',
        },
        {
            title: 'Price',
            dataIndex: 'productPrice',
            key: 'productPrice',
        },
        {
            title: 'Quantity',
            dataIndex: 'productQuantity',
            key: 'productQuantity',
        },
        {
            title: 'Stocks Left',
            dataIndex: 'stocksLeft',
            key: 'stocksLeft',
        },
        {
            title: 'Stocks Out',
            dataIndex: 'stocksOut',
            key: 'stocksOut',
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <div className='d-flex'>
                    <Button className='btn bg-primary py-1 mr-1 text-white ' onClick={() => handleEditProduct(record)}>Edit <i class="pl-2 fa fa-edit"></i></Button>
                    <Button className='btn bg-danger py-1 text-white ' onClick={() => handleDeleteProduct(record)}>Delete<i class="pl-1 fa fa-trash"></i></Button>
                </div>
            ),
        },
    ];

    return (
        <Layout style={{ margin: 0, padding: 0 }}>
            <div style={{ backgroundColor: '#E8F4FE', minHeight: '100vh', padding: '1px' }}>
            <h1 className='mt-24 text-3xl font-bold text-center text-primary'>Inventory</h1>
            <div className='ml-10 mr-10 mb-3'>
            <Link className='button-link mt-2 mb-2 px-2 text-white' to="/admin/add-product">Add Product</Link>

            <Input
                placeholder="Search by Product Name" 
                value={searchQuery}
                onChange={handleSearch}
                onPressEnter={searchProduct}
                prefix={
                    
                      <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                }
            />
            </div>
            
            <Table className='ml-10 mr-10' columns={columns} dataSource={products} />
            {/* </Table> (previously missing) */}
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
                    <Button key="cancel" className='btn bg-warning m-0 text-white' onClick={handleDeleteModalCancel}>
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

export default Inventory;
