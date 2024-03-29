import React, { useState } from 'react'
import './RegisterHead.scss'
import SidebarHead from '../../components/Sidebar/SidebarHead'
import Navbar from '../../components/Navbar/Navbar'
import TableRegis from '../../components/TableOfHead/TableRegis'


function RegisterHead() {
    const [selectedTitle, setSelectedTitle] = useState("Tiểu luận chuyên ngành");
    const handleDropdownClick = (title) => {
        setSelectedTitle(title);
    }
    return (
        <div className='homeHead'>
            <SidebarHead />
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
                                    <a href="#" onClick={() => handleDropdownClick('Tiểu luận chuyên ngành')}>Tiểu luận chuyên ngành</a>
                                    <a href="#" onClick={() => handleDropdownClick('Khóa luận tốt nghiệp')}>Khóa luận tốt nghiệp</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='context-nd' style={{ marginTop: '30px' }}>
                        <div className="form-title">
                            <span>{selectedTitle}</span>
                            <hr className="line" />
                        </div>
                        <div className='card-nd' style={{ display: 'block' }}>
                            <div className='table-items'>
                                <TableRegis/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterHead