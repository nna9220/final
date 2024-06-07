import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/SidebarAdmin'
import './ManagementTopics.scss'
import DataTableTopics from '../../components/dataTable/DataTableTopics'
import { useEffect } from 'react'
function ManagementTopics() {
  useEffect(() => {
    document.title = "Quản lý đề tài";
  }, []);
  return (
    <div className='manaStudentOfAdmin'>
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <hr />
        <div className='widgets'>
          <div className='headMana-class'>
            <div className='titleMana-class'>
              <h5>Quản lý đề tài</h5>
            </div>
          </div>
          <div className='homeMana-class'>
            <DataTableTopics />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManagementTopics