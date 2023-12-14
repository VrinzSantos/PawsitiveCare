import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form handler
  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/register', values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success('Registered Successfully');
        navigate('/login');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something Went Wrong');
    }
  };

  return (
    <div className="bg-gray-200">
      <div className="flex justify-center h-screen">
        <div
          className="bg-cover w-100"
          style={{
            backgroundImage:
              'url(https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs2/267876534/original/cb8f4b3055ba860bec448a759d81888631cec059/design-mental-health-healthcare-and-veterinary-clinic-logo.png)',
          }}
        >
          {/* <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-4xl font-bold text-white">Your Vets Animal Clinic</h2>
              <p className="max-w-xl mt-3 text-gray-300">
              A veterinary facility committed to offering comprehensive healthcare services for pets, 
              providing medical treatments, preventive care, and personalized attention in a caring environment. 
              The clinic's goal is to ensure the well-being and happiness of animals through professional veterinary services.
              </p>
            </div>
          </div> */}
        </div>

        <div className="flex items-center w-full max-w-md px-10">
          <div className="flex-1">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">
                Sign Up
              </h2>
              <p className="mt-3 text-black">Create an account to get started</p>
            </div>

            <div className="mt-8">
              <Form layout="vertical" onFinish={onFinishHandler}>
                <div className="space-y-5">
                  <div className="w-full">
                    <Form.Item label="Name" name="name">
                      <Input type="text" required />
                    </Form.Item>
                  </div>

                  <div className="w-full">
                    <Form.Item label="Email" name="email">
                      <Input type="text" required />
                    </Form.Item>
                  </div>

                  <div className="w-full">
                    <Form.Item label="Password" name="password">
                      <Input type="password" required />
                    </Form.Item>
                  </div>

                  <Form.Item>
                    <Button htmlType="submit" style={{ backgroundColor: '#4a1e8a', color: '#fff' }} className="w-full">
                      REGISTER
                    </Button>
                  </Form.Item>
                </div>
              </Form>

              <p className="mt-6 text-sm text-center text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{color: '#4a1e8a' }} className="focus:outline-none focus:underline hover:underline"
                >
                  Login here
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
