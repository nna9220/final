import React, { useState, useEffect } from 'react'
import SidebarStudent from '../../components/Sidebar/SidebarStudent'
import Navbar from '../../components/Navbar/Navbar'
import './RegisterTopicSt.scss'
import RegisTopicTable from '../../components/Table/RegisTopicTable'

function RegisterTopicSt() {
    useEffect(() => {
        document.title = "Đăng ký đề tài";
      }, []);
    return (
        <div className='RegisterHome'>
            <SidebarStudent />
            <div className='context'>
                <Navbar />
                <hr></hr>
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
                <RegisTopicTable />
            </div>
        </div>
    )
}

export default RegisterTopicSt