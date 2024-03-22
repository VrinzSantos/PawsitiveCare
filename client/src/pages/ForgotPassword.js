import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import "../styles/LayoutStyles.css";
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const onSubmit = async () => {
    try {
      // Send request to initiate password reset
      const response = await axios.post('/api/v1/user/forgot-password', { email }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      message.success(response.data.message);
      // Redirect or show confirmation message
    } catch (error) {
      console.error(error);
      message.error('Failed to initiate password reset.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary min-vh-100">
    <div className='mt-10 container mx-auto p-4 bg-gray-100 border rounded-md max-w-md'>
      <Form onFinish={onSubmit}>

        {/* Email input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>

        {/* Submit button */}
        <div className="text-center">
          <Button id="update" htmlType="submit" className="px-4 bg-blue-500 text-white rounded-md">
            Submit
          </Button>
        </div>

      </Form>
    </div>
    </div>
      );
    };

export default ForgotPassword;
