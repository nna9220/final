import React from 'react'
import SidebarLec from '../../components/Sidebar/SidebarLec'
import Navbar from '../../components/Navbar/Navbar'
import './HomeLec.scss'
import RegisTopicOfLecturer from '../../components/Table/RegisTopicOfLecturer'

function ManageLec() {
  return (
    <div className='homeLec'>
      <SidebarLec></SidebarLec>
      <div className='context'>
        <Navbar />
        <hr></hr>
      </div>
    </div>
  )
}

export default ManageLec