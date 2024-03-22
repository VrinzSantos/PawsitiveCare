import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form handler
  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/login', values);
      dispatch(hideLoading());

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);

        if (res.data.data.isAdmin || res.data.data.isDoctor) {
          navigate('/dashboard');
          window.location.reload();
        } else {
          navigate('/');
          window.location.reload();
        }

        message.success('Login Successfully');
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
              "url(https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs2/267876534/original/cb8f4b3055ba860bec448a759d81888631cec059/design-mental-health-healthcare-and-veterinary-clinic-logo.png)",
          }}
        >
        </div>
        <div className="flex items-center w-full max-w-md px-10 mx-auto">
          <div className="flex-1">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">
                Log In
              </h2>
              <p className="mt-3 text-black">Sign in to access your account</p>
            </div>

            <div className="mt-8">
              <Form layout="vertical" onFinish={onFinishHandler}>
                <div className="space-y-5">
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

                <Link to="/forgot-password" style={{color: '#4a1e8a' }} className="focus:outline-none focus:underline hover:underline">
                Forgot Password
                </Link>

                  <Form.Item>
                    <Button htmlType="submit" style={{ backgroundColor: '#4a1e8a', color: '#fff' }} className="w-full">
                      SIGN IN
                    </Button>
                  </Form.Item>
                </div>
              </Form>
              <p className="mt-6 text-sm text-center text-gray-600">
                <div>
                
                </div>
                Don't have an account yet?{" "}
                <Link
                  to="/register"
                  style={{color: '#4a1e8a' }} className="focus:outline-none focus:underline hover:underline"
                >
                  Sign up
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

export default Login;


