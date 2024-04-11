import React from 'react'
import SidebarHead from '../../components/Sidebar/SidebarHead'
import Navbar from '../../components/Navbar/Navbar'
import './HomeHead.scss'
import { useEffect } from 'react'
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
      </div>
    </div>
  )
}

export default HomeHead