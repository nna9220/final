import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/SidebarAdmin'
import './profile.scss'
import EditProfile from '../../components/Profile/ProfileAd/EditProfile'
import { useEffect } from 'react'
function Profile() {
    useEffect(() => {
        document.title = "Trang cá nhân";
      }, []);
    return (
        <div className='ProfileAdmin'>
            <Sidebar />
            <div className="context">
                <Navbar />
                <hr/>
                <EditProfile/>
            </div>
        </div>
    )
}

export default Profile