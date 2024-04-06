import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/SidebarAdmin'
import './ManagementType.scss'
import DataTableTopics from '../../components/dataTable/DataTableTopics'
import DataTableType from '../../components/dataTable/DataTableType'
function ManagementType() {
  return (
    <div className='manaStudentOfAdmin'>
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <hr />
        <div className="widgets">
          <div className='headMana'>
            <div className='titleMana'>
              <h3>Quản lý loại đề tài</h3>
            </div>
            <div className='homeMana'>
                <DataTableType/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagementType