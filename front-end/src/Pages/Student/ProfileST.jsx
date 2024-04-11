import React from 'react'
import SidebarStudent from '../../components/Sidebar/SidebarStudent'
import Navbar from '../../components/Navbar/Navbar'
import EditProfileSt from '../../components/Profile/ProfileStudent/EditProfileSt'
import './ProfileST.scss'
import { useEffect } from 'react'
function ProfileST() {
  useEffect(() => {
    document.title = "Trang cá nhân";
  }, []);
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