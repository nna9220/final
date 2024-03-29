import React from 'react'
import SidebarHead from '../../components/Sidebar/SidebarHead'
import Navbar from '../../components/Navbar/Navbar'
import './HomeHead.scss'

function HomeHead() {
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