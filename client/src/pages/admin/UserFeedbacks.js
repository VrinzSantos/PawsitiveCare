import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { Table, Rate } from 'antd';

const UserFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const getFeedbacks = async () => {
      try {
          const res = await axios.get('/api/v1/user/feedbacks', {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
          });
          if (res.data.success) {
              setFeedbacks(res.data.data);
          }
      } catch (error) {
          console.log(error);
      }
  };

  useEffect(() => {
      getFeedbacks();
  }, []);

  const columns = [
      {
          title: 'Category',
          dataIndex: 'category',
          key: 'category',
      },
      {
          title: 'Feedback',
          dataIndex: 'feedback',
          key: 'feedback',
      },
      {
          title: 'Ratings',
          dataIndex: 'ratings',
          key: 'ratings',
          render: (rating) => <Rate disabled defaultValue={rating} />,
          align: 'center', // Center the content in the column
      },
  ];

  return (
    <Layout style={{ margin: 0, padding: 0 }}>
        <div style={{ backgroundColor: '#E8F4FE', minHeight: '100vh', padding: '1px' }}>
          <h1 className='mt-24 text-3xl mb-3 font-bold text-center text-secondary'>Feedbacks</h1>
          <Table className='mr-20 ml-20' columns={columns} dataSource={feedbacks} />
        </div>
    </Layout>
  );
};

export default UserFeedbacks