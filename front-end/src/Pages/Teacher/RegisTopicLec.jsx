import React from 'react'
import SidebarLec from '../../components/Sidebar/SidebarLec'
import Navbar from '../../components/Navbar/Navbar'
import './HomeLec.scss'
import RegisTopicOfLecturer from '../../components/Table/RegisTopicOfLecturer'

function RegisTopicLec() {
  return (
    <div className='homeLec'>
      <SidebarLec></SidebarLec>
      <div className='context'>
        <Navbar/>
        <hr />
        <div className='context-menu'>
          <div className='contaxt-title'>
            <div className='title-re'>
              <h3>ĐĂNG KÝ ĐỀ TÀI</h3>
            </div>
          </div>
          <div className='context-nd'>
            <div className='card-nd'>
              <div class="dropdown">
                <div class="dropdown-title">Chọn loại luận văn</div>
                <div class="dropdown-content">
                  <a href="#">Tiểu luận chuyên ngành</a>
                  <a href="#">Khóa luận tốt nghiệp</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <RegisTopicOfLecturer />
      </div>
    </div>
  )
}

export default RegisTopicLec