import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/SidebarAdmin'
import './profile.scss'
import EditProfile from '../../components/Profile/ProfileAd/EditProfile'

function Profile() {
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