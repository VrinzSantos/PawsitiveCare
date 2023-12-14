import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { id, token } = useParams();
  
    const handleSubmit = async () => {
      try {
        // Ensure that a valid token is available before sending the request
        if (!token) {
          console.error('Invalid token.');
          return;
        }
  
        // Send request to reset password
        const res = await axios.post(`/api/v1/user/reset-password/${id}/${token}`, { password });
  
        if (res.data.Status === 'Success') {
          message.success('Password reset successfully.');
          navigate('/');
        }
      } catch (err) {
        console.error(err);
        message.error('Failed to reset password.');
      }
    };
  
    return (
<div className="d-flex justify-content-center align-items-center bg-secondary min-vh-100">
  <div className="bg-white p-4 container mx-auto border rounded-md max-w-xl">
    <h4 className="text-gray-700 mb-2">Reset Password</h4>
    <Form onFinish={handleSubmit}>

      {/* New Password input */}
      <div className="">
        <label htmlFor="password" className="">
          <strong className='text-gray-700'>New Password</strong>
        </label>
        <Input.Password
          placeholder="Enter Password"
          autoComplete="off"
          name="password" className="form-control rounded-0" value={password} onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Update button */}
      <div className='text-center'>
      <Button  htmlType="submit" className="px-4 mt-4 rounded-md bg-blue-500 text-white">
        Update
      </Button>
      </div>
    </Form>
  </div>
</div>
    );
  };
  
  export default ResetPassword;