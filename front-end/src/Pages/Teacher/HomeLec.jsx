import React from 'react'
import SidebarLec from '../../components/Sidebar/SidebarLec'
import Navbar from '../../components/Navbar/Navbar'
import './HomeLec.scss'
import { useEffect } from 'react'
import NotificationOfLecturer from '../../components/Notification/NotificationOfLecturer'
function HomeLec() {
  useEffect(() => {
    document.title = "Trang chủ giảng viên";
  }, []);
  return (
    <div className='homeLec'>
      <SidebarLec></SidebarLec>
      <div className='context'>
        <Navbar/>
        <hr/>
        <div className='widgets'>
          <div className='header-notification'>
            <h4 className='title'>TRANG CỦA BẠN</h4>
          </div>
          <NotificationOfLecturer />
        </div>
      </div>
    </div>
  )
}

export default HomeLec