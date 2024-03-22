import React, { useState } from 'react';
import '../styles/LayoutStyles.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Images from '../constants/Image';

const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const getPopupContainer = () => document.getElementById('custom-dropdown-container');

  const guestMemberMenu = ( 
    <Menu>
      <Menu.Item key="guests">
        <Link to="/admin/users">Guests</Link>
      </Menu.Item>
      <Menu.Item key="members">
        <Link to="/admin/members">Members</Link>
      </Menu.Item>
    </Menu>
  );

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  

  const handleLogout = () => {
    localStorage.clear();
    alert("Logout Successfully");
    navigate('/login');
  };

  const redirectToUserProfile = (userId) => {
    const userProfileUrl = `/user/profile/${user?._id}`;
    navigate(userProfileUrl); 
  };
  const toggleProfileDialog = () => {
    setProfileDialogOpen((prevOpen) => !prevOpen);
  };

  // Doctor menu
  const userMenu = [
    {
      name: 'Home',
      path: '/',
      icon: 'fa-solid fa-house',
    },

    {
      name: 'Feedbacks',
      path: '/user/feedbacks',
      icon: 'fa-solid fa-comments',
    },
    {
      name: 'Appointments',
      path: '/appointments',
      icon: 'fa-solid fa-list-check',
    },
    {
      name: 'Apply Membership',
      path: '/apply-membership',
      icon: 'fa-solid fa-address-card',
    },
    // {
    //   name: 'Create Feedback',
    //   path: '/user/create-feedback',
    //   icon: 'fa-solid fa-comment',
    // },
    // {
    //   name: 'Profile',
    //   path: `/user/profile/${user?._id}`,
    //   icon: 'fa-solid fa-user',
    // },
  ];

  const adminMenu = [
    {
      name: 'Home',
      path: '/dashboard',
      icon: 'fa-solid fa-house',
    },
    {
      name: 'Appointments',
      path: '/handleDoctor-appointments',
      icon: 'fa-solid fa-list',
    },
    {
      name: 'POS',
      path: '/admin/create-order',
      icon: 'fa-solid fa-cart-plus',
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: 'fa-solid fa-clipboard',
    },
    {
      name: 'Inventory',
      path: '/admin/inventory',
      icon: 'fa-solid fa-box',
    },
    {
      name: 'Feedbacks',
      path: '/admin/user-feedbacks',
      icon: 'fa-solid fa-comments',
    },
    {
      name: 'Pet Onwers Records',
      path: '/admin/client-records',
      icon: 'fa-solid fa-user-group',
    },
    // {
    //   name: 'Members',
    //   path: '/admin/members',
    //   icon: 'fa-solid fa-user-doctor',
    // },
    // {
    //   name: 'Guests',
    //   path: '/admin/users',
    //   icon: 'fa-solid fa-user',
    // },
    //{
     // name: 'Profile',
     // path: `/admin/profile/${user?._id}`,
     // icon: 'fa-solid fa-user',
   // },
  ];

  const doctorMenu = [
    {
      name: 'Home',
      path: '/dashboard',
      icon: 'fa-solid fa-house',
    },
    {
      name: 'Appointments',
      path: '/doctor-appointments',
      icon: 'fa-solid fa-list',
    },
   // {
     // name: 'Profile',
     // path: `/doctor/profile/${user?._id}`,
     // icon: 'fa-solid fa-user',
   // },
  ];

  const toggleMenu = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };


  // Rendering menu list
  const NavbarMenu = user?.isAdmin
    ? adminMenu.map((menu) => ({
        ...menu,
        path: menu.path.replace(':id', user?._id), // Replace ':id' with the user's ID
      }))
    : user?.isDoctor
    ? doctorMenu.map((menu) => ({
        ...menu,
        path: menu.path.replace(':id', user?._id), // Replace ':id' with the user's ID
      }))
    : userMenu;

    return (
      <>
        <div className="main">
          <div className="layout">
            <div className={`navbar ${menuOpen ? 'menu-open' : ''}`} id="navbar">
              <div className="logo">
                <img src={Images.Logo1} alt="Your Vets Animal Clinic Logo" className="logo-image" />
              </div>

              <div className="d-flex justify-content-end">
                <div className="icon" onClick={toggleMenu}>
                  <i className={`fa ${menuOpen ? 'fa-times' : 'fa-bars'}`} style={{ cursor: 'pointer' }}></i>
                </div>
              </div>

              <div className={`menu ${menuOpen ? 'menu-open' : ''}`}>
                {NavbarMenu.map((menu) => {
                  const isActive = location.pathname === menu.path;
                  return (
                    <div key={menu.name} className={`menu-item ${isActive && 'active'}`}>
                      <Link to={menu.path} onClick={() => setMenuOpen(false)}>
                        <i style={{ cursor: 'pointer' }} className={menu.icon}></i>
                        {menu.name}
                      </Link>
                    </div>
                  );
                })} 

                {user && user.isAdmin && (
                  <div className="admin-dropdown">
                    <Dropdown overlay={guestMemberMenu} trigger={['click']} placement="bottomRight">
                      <a className="ant-dropdown-link text-white" onClick={(e) => e.preventDefault()}>
                        <i class="fa-solid fa-users"></i> <DownOutlined />
                      </a>
                    </Dropdown>
                  </div>
                )}

                <div className="notification-profile-container">
                  {user && user.notification.length > 0 ? (
                    <div className="relative inline-block">
                      <Link to="/notification">
                        <i style={{ cursor: 'pointer' }} className="fa-solid fa-bell text-white text-2xl w-11 ml-5"></i>
                      </Link>
                      <span className="absolute right-4 -mt-1 -mr-4 bg-red-500 text-white rounded-full space-x-5 px-2">
                        {user.notification.length}
                      </span>
                    </div>
                  ) : (
                    <Link to="/notification">
                      <i style={{ cursor: 'pointer' }} className="fa-solid fa-bell text-white text-2xl justify-center"></i>
                    </Link>
                  )}

                  <button onClick={toggleProfileDialog} className="profile-button text-white">
                    <i className="fa-solid fa-user text-2xl pl-5"></i>
                  </button>

                  {profileDialogOpen && (
                    <div className="profile-dialog">
                      <div className="profile-dialog-content">
                        <p className='ml-5 pr-5 font-bold'>{user?.name}</p>
                        <div className="profile-options">
                          <button className='text-black pr-10 bg-gray-500' onClick={() => redirectToUserProfile(user._id)}>
                            <i className=" fa fa-solid fa-gear text-black"></i> Edit profile
                          </button>
                        </div>

                        <div className="profile-options">
                          <button className='pr-16' onClick={handleLogout}>
                            <i className="fa-sharp fa-solid fa-arrow-right-from-bracket text-black "></i> Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="body">{children}</div>
          </div>
        </div>
      </>
      );
    };

export default Layout;
