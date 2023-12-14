import React from 'react';
import Layout from '../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import axios from 'axios';

const ApplyMembership = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        '/api/v1/user/apply-membership',
        { ...values, userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        alert(res.data.message); // You can replace this with your preferred notification method
        navigate('/');
      } else {
        alert(res.data.error); // You can replace this with your preferred notification method
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      alert('Something went wrong'); // You can replace this with your preferred notification method
    }
  };

  return (
    <Layout style={{ margin: 0, padding: 0 }}>
      <div style={{ backgroundColor: '#E8F4FE', minHeight: '100vh', padding: '1px' }}>
        <section className="container1 mx-auto p-4 grid-cols-1 ml-10 mr-10">
          <h2 className="text-center text-3xl font-bold leading-10 tracking-tight mt-2">
            <span className="text-secondary">Membership</span> <span className="text-primary">Form</span>
          </h2>
          <form onSubmit={handleFinish} className="mt-4">
            {/* Personal Details */}
            <div className="mb-4">
              <h4 className="font-bold">Personal Details:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="mt-3">Owners Name</label>
                  <input
                    type="text"
                    name="ownersName"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <input
                    type="text"
                    name="email"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pet Details */}
            <div className="mb-4">
              <h4 className="font-bold">Pet Details:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block mb-2">Pets Name</label>
                  <input
                    type="text"
                    name="petsName"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Species</label>
                  <input
                    type="text"
                    name="species"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Breed</label>
                  <input
                    type="text"
                    name="breed"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="form-btn py-1 mt-3 rounded"
                style={{ backgroundColor: '#4a1e8a', color: '#fff' }}
              >
                Submit
              </button>
            </div>
          </form>
        </section>
      </div>
    </Layout>
  );
};

export default ApplyMembership;
