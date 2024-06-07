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
                <hr />
                <div className='headMana-class'>
                    <div className='titleMana-class'>
                        <h5>Trang cá nhân</h5>
                    </div>
                </div>
                <div className='homeMana-class'>
                    <EditProfile />
                </div>
            </div>
        </div>
    )
}

export default Profile