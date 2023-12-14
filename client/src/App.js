import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ApplyMembership from './pages/ApplyMembership';
import NotificationPage from './pages/NotificationPage';
import Users from './pages/admin/Users';
import Members from './pages/admin/Members';
import Profile from './pages/doctor/Profile';
import BookingPage from './pages/BookingPage';
import Appointments from './pages/Appointments';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import EditAppointment from './pages/EditAppointment';
import CreateFeedback from './pages/CreateFeedback';
import Feedbacks from './pages/Feedbacks';
import UserFeedbacks from './pages/admin/UserFeedbacks';
import EditFeedback from './pages/EditFeedback';
import Inventory from './pages/admin/Inventory';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import CreateOrder from './pages/admin/CreateOrder';
import AdminProfile from './pages/admin/AdminProfile';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import ClientRecords from './pages/admin/ClientRecords';
import CreateClientRecords from './pages/admin/CreateClientRecords';
import EditClientRecords from './pages/admin/EditClientRecords';
import ViewRecordDetails from './pages/admin/ViewRecordDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ViewFullDetails from './pages/admin/ViewFullDetails';


function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <>
      <BrowserRouter>
      { loading ? (
        <Spinner />
        ) : (
          <Routes>
          <Route path = "/" 
          element = {
          <ProtectedRoute>
            <Homepage/>
          </ProtectedRoute>
        }/>
        <Route path = "/apply-membership" 
          element = {
          <ProtectedRoute>
            <ApplyMembership/>
          </ProtectedRoute>
        }/>
         <Route path = "/admin/users" 
          element = {
          <ProtectedRoute>
            <Users/>
          </ProtectedRoute>
        }/>
        <Route path = "/doctor/book-appointment/:doctorId" 
          element = {
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        }/>
        <Route path = "/doctor/profile/:id" 
          element = {
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }/>
        <Route path = "/admin/members" 
          element = {
          <ProtectedRoute>
            <Members/>
          </ProtectedRoute>
        }/>
        <Route path = "/notification" 
          element = {
          <ProtectedRoute>
            <NotificationPage/>
          </ProtectedRoute>
        }/>
          <Route path = "/login" 
          element = {
          <PublicRoute>
            <Login/>
          </PublicRoute>
          }
          />
          <Route path = "/forgot-password" 
          element = {
          <PublicRoute>
            <ForgotPassword/>
          </PublicRoute>
          }
          />
          <Route path = "/reset-password/:id/:token" 
          element = {
          <PublicRoute>
            <ResetPassword/>
          </PublicRoute>
          }
          />
          <Route path = "/register" 
          element = {
          <PublicRoute>
            <Register/>
            </PublicRoute>
          }/>
          <Route path = "/appointments" 
          element = {
          <ProtectedRoute>
            <Appointments/>
            </ProtectedRoute>
          }/>
          <Route path = "/doctor-appointments" 
          element = {
          <ProtectedRoute>
            <DoctorAppointments/>
            </ProtectedRoute>
          }/>
          <Route path = "/edit-appointment/:appointmentId" 
          element = {
          <ProtectedRoute>
            <EditAppointment/>
            </ProtectedRoute>
          }/>
          <Route path = "/user/create-feedback" 
          element = {
          <ProtectedRoute>
            <CreateFeedback/>
            </ProtectedRoute>
          }/>
          <Route path = "/user/feedbacks" 
          element = {
          <ProtectedRoute>
            <Feedbacks/>
            </ProtectedRoute>
          }/>
          <Route path = "/admin/user-feedbacks" 
          element = {
          <ProtectedRoute>
            <UserFeedbacks/>
            </ProtectedRoute>
          }/>
          <Route path = "/edit-feedback/:feedbackId" 
          element = {
          <ProtectedRoute>
            <EditFeedback/>
            </ProtectedRoute>
          }/>
          <Route path = "/admin/inventory" 
          element = {
          <ProtectedRoute>
            <Inventory/>
            </ProtectedRoute>
          }/>
          <Route path = "/admin/add-product" 
          element = {
          <ProtectedRoute>
            <AddProduct/>
            </ProtectedRoute>
          }/>
          <Route path = "/admin/edit-product/:productId" 
          element = {
          <ProtectedRoute>
            <EditProduct/>
            </ProtectedRoute>
          }/>
          <Route path = "/admin/create-order" 
          element = {
          <ProtectedRoute>
            <CreateOrder/>
            </ProtectedRoute>
          }/>
          <Route path = "/admin/orders" 
          element = {
          <ProtectedRoute>
            <Orders/>
            </ProtectedRoute>
          }/>
          <Route path = "/admin/profile/:id" 
          element = {
          <ProtectedRoute>
            <AdminProfile/>
            </ProtectedRoute>
          }/>
          <Route path = "/user/profile/:id" 
          element = {
          <ProtectedRoute>
            <UserProfile/>
            </ProtectedRoute>
          }/>
          <Route path = "/dashboard" 
          element = {
          <ProtectedRoute>
            <Dashboard/>
            </ProtectedRoute>
          }/>
          <Route path = "/admin/client-records" 
          element = {
          <ProtectedRoute>
            <ClientRecords/>
            </ProtectedRoute>
          }/>
          <Route path = "/admin/create-client-records" 
          element = {
          <ProtectedRoute>
            <CreateClientRecords/>
            </ProtectedRoute>
          }/>
          <Route path = "/admin/edit-client-records/:recordId" 
          element = {
          <ProtectedRoute>
            <EditClientRecords/>
            </ProtectedRoute>
          }/>
          <Route path = "/admin/view-record-details/:recordId" 
          element = {
          <ProtectedRoute>
            <ViewRecordDetails/>
            </ProtectedRoute>
          }/>
          <Route path = "/admin/view-full-details/:recordId" 
          element = {
          <ProtectedRoute>
            <ViewFullDetails/>
            </ProtectedRoute>
          }/>
      </Routes>
        )}
      </BrowserRouter>

    </>
  );
}

export default App;
