import React from 'react'
import SidebarLec from '../../components/Sidebar/SidebarLec'
import Navbar from '../../components/Navbar/Navbar'
import './HomeLec.scss'
import { useEffect } from 'react'
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
      </div>
    </div>
  )
}

export default HomeLec