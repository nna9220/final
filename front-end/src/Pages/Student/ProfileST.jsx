import React from 'react'
import SidebarStudent from '../../components/Sidebar/SidebarStudent'
import Navbar from '../../components/Navbar/Navbar'
import EditProfileSt from '../../components/Profile/ProfileStudent/EditProfileSt'
import './ProfileST.scss'

function ProfileST() {
  return (
    <div className='profileST'>
        <SidebarStudent></SidebarStudent>
        <div className='context'>
            <Navbar/>
            <hr/>
            <EditProfileSt/>
        </div>
    </div>
  )
}

export default ProfileST