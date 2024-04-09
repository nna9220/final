import React from 'react'
import SidebarLec from '../../components/Sidebar/SidebarLec'
import Navbar from '../../components/Navbar/Navbar'
import './ManageLec.scss'
import ManagermentTask from '../../components/KanbanOfLecturer/ManagermentTask'

function ManageLec() {
  return (
    <div className='homeLec'>
      <SidebarLec></SidebarLec>
      <div className='context'>
        <Navbar />
        <hr></hr>
        <h3 className='title-pb'>QUẢN LÝ ĐỀ TÀI</h3>
        <div className='body-table'>
          <ManagermentTask />
        </div>
      </div>
    </div>
  )
}

export default ManageLec