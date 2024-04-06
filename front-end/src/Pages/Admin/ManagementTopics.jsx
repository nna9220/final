import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/SidebarAdmin'
import './ManagementTopics.scss'
import DataTableTopics from '../../components/dataTable/DataTableTopics'
function ManagementTopics() {
  return (
    <div className='manaStudentOfAdmin'>
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <hr />
        <div className="widgets">
          <div className='headMana'>
            <div className='titleMana'>
              <h3>Quản lý đề tài</h3>
            </div>
            <div className='homeMana'>
              <DataTableTopics />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagementTopics