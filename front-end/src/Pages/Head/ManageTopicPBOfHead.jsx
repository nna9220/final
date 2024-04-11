import React from 'react'
import SidebarHead from '../../components/Sidebar/SidebarHead'
import Navbar from '../../components/Navbar/Navbar'
import TopicPBTableHead from '../../components/TableOfHead/TopicPBTableHead'
import './ManageTopicPBOfHead.scss'

function ManageTopicPBOfHead() {
  return (
    <div className='homeHead'>
      <SidebarHead/>
      <div className='context'>
        <Navbar></Navbar>
        <hr></hr>
        <h3 className='title-pb'>QUẢN LÝ ĐỀ TÀI PHẢN BIỆN</h3>
        <div className='body-table'>
            <div><TopicPBTableHead/></div>
        </div>
      </div>
    </div>
  )
}

export default ManageTopicPBOfHead