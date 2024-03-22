import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input,  message } from 'antd'
import { showLoading, hideLoading } from '../../redux/features/alertSlice'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

const Profile = () => {
  const { user } = useSelector((state) => state.user)
  const [ doctor, setDoctor ] = useState(null)
  const params = useParams();
  const dispatch = useDispatch()
  const navigate = useNavigate()

//update doc
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading())
      const res = await axios.post('/api/v1/doctor/updateProfile', {...values, userId: user._id}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
      })
      dispatch(hideLoading())
      if(res.data.success) {
        message.success(res.data.message)
        navigate('/')
      } else {
        message.error(res.data.success)
      }
    } catch (error) {
      dispatch(hideLoading())
      console.log(error)
      message.error('Something went wrong')
    }
  }

  //getDoctor Details
  const getDoctorInfo = async() => {
    try {
      const res = await axios.post('/api/v1/doctor/getDoctorInfo', 
      {userId: params.id}, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (res.data.success) {
        setDoctor(res.data.data)
        console.log('Doctor data retrieved successfully:', res.data.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDoctorInfo()
    //eslint-disable-next-line
  }, [])
  return (
    <Layout>
        <h1 className='mt-20 text-center font-bold text-2xl'>Manage Profile</h1>
        <div className='form2'>
        {doctor && (
            <Form layout = 'vertical' onFinish={handleFinish} className='mt-4' initialValues={doctor}>
            <h4 className='mb-3 text-lg font-bold'> Personal Details </h4>
                
                      <Form.Item label = 'Name' name = "name" required rules={[{required: true}]}>
                        <Input type = 'text' placeholder = 'Name'/>
                      </Form.Item>

                      <Form.Item label = 'Address' name = "address" required rules={[{required: true}]}>
                        <Input type = 'text' placeholder = 'Address'/>
                      </Form.Item>


                      <Form.Item label = 'Phone' name = "phone" required rules={[{required: true}]}>
                        <Input type = 'text' placeholder = 'Phone Number'/>
                      </Form.Item>


                      <Form.Item label = 'Email' name = "email" required rules={[{required: true}]}>
                        <Input type = 'text' placeholder = 'Email'/>
                      </Form.Item>

                <div className='d-flex justify-content-center'>
                  <button className = 'btn bg-primary form-btn text-white ' type = "submit">Update</button>
                </div>
                
            </Form>
        )}
        </div>
    </Layout>

  )
}

export default Profile