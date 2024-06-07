import SidebarHead from '../../components/Sidebar/SidebarHead'
import Navbar from '../../components/Navbar/Navbar'
import './ProfileHe.scss'
import EditProfileHe from '../../components/Profile/ProfileHead/EditProfileHe'
import React, { useState, useEffect, useContext } from 'react';
import { NotificationContext } from './NotificationContext';

function ProfileHe() {
  useEffect(() => {
    document.title = "Trang cá nhân";
  }, []);
  const { notifications, unreadCount } = useContext(NotificationContext);
  
  return (
    <div className='homeProfile'>
      <SidebarHead/>
      <div className='context'>
      <Navbar unreadCount={unreadCount} />
        <hr></hr>
        <EditProfileHe/>
      </div>
    </div>
  )
}

export default ProfileHe