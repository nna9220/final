import React from 'react'
import SidebarLec from '../../components/Sidebar/SidebarLec'
import Navbar from '../../components/Navbar/Navbar'
import './HomeLec.scss'
import Booard from '../../components/KanbanOfLecturer/Booard'
import { useState, useEffect } from 'react'
import axios from 'axios'
import ManagermentTask from '../../components/KanbanOfLecturer/ManagermentTask'
function ManageLec() {
  const [topics, setTopics] = useState([]);
  const [showManagementTask, setShowManagementTask] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState("");
  const [showBackButton, setShowBackButton] = useState(false);

  return (
    <div className='homeLec'>
      <SidebarLec></SidebarLec>
      <div className='context'>
        <Navbar />
        <hr></hr>
        <h3>QUẢN LÝ ĐỀ TÀI</h3> 
        <ManagermentTask/>
      </div>
    </div>
  )
}

export default ManageLec