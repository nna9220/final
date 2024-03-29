import React from 'react'
import SidebarHead from '../../components/Sidebar/SidebarHead'
import Navbar from '../../components/Navbar/Navbar'
import './ProfileHe.scss'
import EditProfileHe from '../../components/Profile/ProfileHead/EditProfileHe'

function ProfileHe() {
  return (
    <div className='homeProfile'>
      <SidebarHead/>
      <div className='context'>
        <Navbar/>
        <hr></hr>
        <EditProfileHe/>
      </div>
    </div>
  )
}

export default ProfileHe