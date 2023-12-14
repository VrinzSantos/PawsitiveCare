import React from 'react'
import Layout from '../components/Layout'
import { Tabs, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoading, showLoading } from '../redux/features/alertSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const NotificationPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.user)
    //handle read notification
    const handleMarkAsAllRead = async() => {
        try {
            dispatch(showLoading())
            const res = await axios.post('/api/v1/user/get-all-notification', {userId:user._id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            dispatch(hideLoading())
            if (res.data.success) {
                message.success(res.data.message)
                window.location.reload();
            } else {
                message.error(res.data.message)
            }
        } catch (error) {
            dispatch(hideLoading())
            console.log(error)
            message.error('Something went wrong')
        }
    }

    //delete notifications
    const handleDeleteAllRead = async (req, res) => {
        try {
            dispatch(showLoading())
            const res = await axios.post('/api/v1/user/delete-all-notification', {userId:user._id}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            dispatch(hideLoading())
            if (res.data.success) {
                window.location.reload();
                message.success(res.data.message)
            } else {
                message.error(res.data.message)
            }
        } catch (error) {
            console.log(error)
            message.error('Something went wrong')
        }
    }
  return (
    <Layout style={{ margin: 0, padding: 0 }}>
        <div style={{ backgroundColor: '#E8F4FE', minHeight: '100vh', padding: '1px' }}>
        <h4 className=' text-center mt-24 font-bold text-3xl'><span class='text-warning'>Notification</span> <span class='text-primary'>Page</span></h4>
        <Tabs className='px-10'>
            <Tabs.TabPane tab = "Unread" key={0}>
                <div className='d-flex justify-content-end'>
                    <h4 className='p-2 text-primary' style={{ cursor: 'pointer' }} onClick={handleMarkAsAllRead}>Mark as All Read</h4>
                </div>
                {user?.notification.map((notificationMsgs) => (
                        <div className='card p-1 font-semibold mb-1' style={{ cursor: 'pointer' }}>
                            <div className='card-text' onClick={() => navigate(notificationMsgs.onClickPath)}>
                                {notificationMsgs.message}
                            </div>
                        </div>
                    ))}
            </Tabs.TabPane>
            <Tabs.TabPane tab = "Read" key={1}>
                <div className='d-flex justify-content-end'>
                    <h5 className='p-2 text-primary' style={{ cursor: 'pointer' }} onClick={handleDeleteAllRead}>Delete All Read Messages</h5>
                </div>
                {user?.seennotification.map((notificationMsgs) => (
                        <div className='card py-1 p-1' style={{cursor: 'pointer'}}>
                            <div className='card-text' onClick={() => navigate(notificationMsgs.onClickPath)}>
                                {notificationMsgs.message}
                            </div>
                        </div>
                    ))}
            </Tabs.TabPane>
        </Tabs>
        </div>
    </Layout>
    
  )
}

export default NotificationPage