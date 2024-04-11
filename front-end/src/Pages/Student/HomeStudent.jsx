import React from 'react'
import './homeStudent.scss'
import SidebarStudent from '../../components/Sidebar/SidebarStudent'
import Navbar from '../../components/Navbar/Navbar'
import Context from '../../components/Context/Context'
import { useEffect } from 'react'
function HomeStudent() {
  useEffect(() => {
    document.title = "Trang chủ sinh viên";
  }, []);
  return (
    <div className='HomeStudent'>
        <SidebarStudent/>
        <div className='context'>
          <Navbar/>
          <hr/>
          <div className='widgets'>
            <div className='header-notification'>
              <h4 className='title'>TRANG CỦA BẠN</h4>
            </div>
                <Context/>
            </div>
        </div>
    </div>
  )
}

export default HomeStudent