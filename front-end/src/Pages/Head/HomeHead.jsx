import React from 'react'
import SidebarHead from '../../components/Sidebar/SidebarHead'
import Navbar from '../../components/Navbar/Navbar'
import './HomeHead.scss'
import { useEffect } from 'react'
import NotificationOfHeader from '../../components/Notification/NotificationOfHeader'
function HomeHead() {
  useEffect(() => {
    document.title = "Trang chủ Trưởng bộ môn";
  }, []);
  return (
    <div className='homeHead'>
      <SidebarHead/>
      <div className='context'>
        <Navbar></Navbar>
        <hr></hr>
        <div className='widgets'>
          <div className='header-notification'>
            <h4 className='title'>TRANG CỦA BẠN</h4>
          </div>
          <NotificationOfHeader />
        </div>
      </div>
    </div>
  )
}

export default HomeHead