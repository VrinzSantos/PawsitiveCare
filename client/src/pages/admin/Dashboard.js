import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import WeeklySalesChart from '../../Data/WeeklySalesChart';
import ProductCategoryDistributionChart from '../../Data/ProductCategoryDistribution';
import FastestSellingProductChart from '../../Data/FastestSellingProductChart';
import NumberOfProducts from '../../Data/NumberOfProducts';
import MonthlySalesChart from '../../Data/MonthlySalesChart';
import NumberOfUsers from '../../Data/NumberOfUsers';
import SalesToday from '../../Data/SalesToday';
import axios from 'axios';

const Dashboard = () => {
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [fastestSellingProducts, setFastestSellingProducts] = useState([]);
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const getProductCategoryDistribution = async () => {
      try {
        const res = await axios.get('/api/v1/analytics/product-category-distribution', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (res.data.success) {
          setCategoryDistribution(res.data.categoryDistribution);
        }
      } catch (error) {
        console.error('Error fetching product category distribution:', error);
      }
    };

    const fetchUserCount = async () => {
      try {
        const res = await axios.get('/api/v1/analytics/user-count', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
    
        if (res.data.success) {
          setUserCount(res.data.userCount);
        }
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    const fetchMonthlySalesData = async () => {
      try {
        const res = await axios.get('/api/v1/analytics/monthly-sales', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (res.data.success) {
          setMonthlySalesData(res.data.monthlySalesData);
          console.log('Monthly Sales Data:', res.data.monthlySalesData);
        }
      } catch (error) {
        console.error('Error fetching monthly sales data:', error);
      }
    };

    const getFastestSellingProducts = async () => {
      try {
        const res = await axios.get('/api/v1/analytics/fastest-selling-products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (res.data.success) {
          setFastestSellingProducts(res.data.fastestSellingProducts);
        }
      } catch (error) {
        console.error('Error fetching fastest selling products:', error);
      }
    };


    const fetchNumberOfProducts = async () => {
      try {
        const res = await axios.get('/api/v1/analytics/number-of-products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (res.data.success) {
          setNumberOfProducts(res.data.numberOfProducts);
        }
      } catch (error) {
        console.error('Error fetching number of products:', error);
      }
    };

    getProductCategoryDistribution();
    getFastestSellingProducts();
    fetchNumberOfProducts();
    fetchMonthlySalesData();
    fetchUserCount();
  }, []);

  return (
    <Layout style={{ margin: 0, padding: 0 }}>
    <div style={{ backgroundColor: '#E8F4FE', minHeight: '100vh', padding: '1px' }}>
    <h1 className='mt-24 text-3xl font-bold text-center text-secondary'>Dashboard</h1>
      <div className="dashboard-container">
          <div className="dashboard-content">

          <div className='containers'>
            <div className='sales-today'>
              <div className='sales-today-content'>
                <SalesToday />
              </div>
              <div className='user-info'>
                <NumberOfUsers userCount={userCount} />
              </div>
              <div className='user-product-info'>
                <NumberOfProducts numberOfProducts={numberOfProducts} />
              </div>
            </div>
          </div>

          <div className='containers1'>
            <div className='chart-container'>
              <div className='weekly-sales-container'>
                <div className='chart-content'>
                  <WeeklySalesChart />
                </div>
              </div>
              <div className='fastest-selling-container'>
                <div className='chart-content'>
                  <FastestSellingProductChart fastestSellingProducts={fastestSellingProducts} />
                </div>
              </div>
            </div>
          </div>
          

              <div className='containers2'>
                <div className='category-sales-container'>
                <div className='larger-chart'>
                    <ProductCategoryDistributionChart categoryDistribution={categoryDistribution} />
              </div> 
                <div className='smaller-chart'>
                <MonthlySalesChart monthlySalesData={monthlySalesData} />
              </div>
            </div>
          </div>


          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;