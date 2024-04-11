import React from 'react'
import SidebarLec from '../../components/Sidebar/SidebarLec'
import Navbar from '../../components/Navbar/Navbar'
import './ProfileLec.scss'
import EditProfileLec from '../../components/Profile/ProfileLec/EditProfileLec'
import { useEffect } from 'react'

function ProfileLec() {
  useEffect(() => {
    document.title = "Trang cá nhân";
  }, []);
  return (
    <div className='homeProfile'>
      <SidebarLec/>
      <div className='context'>
        <Navbar/>
        <hr></hr>
        <EditProfileLec/>
      </div>
    </div>
  )
}

export default ProfileLec