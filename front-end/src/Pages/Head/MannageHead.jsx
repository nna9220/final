import React, { useState } from 'react';
import SidebarHead from '../../components/Sidebar/SidebarHead';
import Navbar from '../../components/Navbar/Navbar';
import './MannageHead.scss';
import TableApprove from '../../components/TableOfHead/TableApprove';
import TbaleAssign from '../../components/TableOfHead/TbaleAssign';
import TableRegis from '../../components/TableOfHead/TableRegis';
import TableTopic from '../../components/TableOfHead/TableTopic';

function MannageHead() {
  const [selectedTitle, setSelectedTitle] = useState({ title1: 'Duyệt đề tài', title2: '', table: null });

  const handleDropdownClick = (title1, title2, table) => {
    setSelectedTitle({ title1, title2, table });
  };

  return (
    <div className='homeManagement'>
      <SidebarHead />
      <div className='managementContext'>
        <Navbar />
        <hr />
        <div className='context-menu'>
          <div className='contaxt-title'>
            <div className='title-re'>
              <h3>QUẢN LÝ ĐỀ TÀI</h3>
            </div>
          </div>
          <div className='context-nd'>
            <div className='card-nd'>
              <div className="dropdown">
                <div className="dropdown-title">Duyệt đề tài</div>
                <div className="dropdown-content">
                  <a href="#" onClick={() => handleDropdownClick('Duyệt đề tài', 'Tiểu luận chuyên ngành', <TableApprove />)}>Tiểu luận chuyên ngành</a>
                  <a href="#" onClick={() => handleDropdownClick('Duyệt đề tài', 'Khóa luận tốt nghiệp')}>Khóa luận tốt nghiệp</a>
                </div>
              </div>
              <div className="dropdown">
                <div className="dropdown-title">Phân Giảng viên phản biện</div>
                <div className="dropdown-content">
                  <a href="#" onClick={() => handleDropdownClick('Phân giảng viên phản biện', 'Tiểu luận chuyên ngành',<TbaleAssign/>)}>Tiểu luận chuyên ngành</a>
                  <a href="#" onClick={() => handleDropdownClick('Phân giảng viên phản biện', 'Khóa luận tốt nghiệp')}>Khóa luận tốt nghiệp</a>
                </div>
              </div>
              <div className="dropdown">
                <div className="dropdown-title">Đề tài của tôi</div>
                <div className="dropdown-content">
                  <a href="#" onClick={() => handleDropdownClick('Đề tài của tôi', 'Tiểu luận chuyên ngành', <TableTopic/>)}>Tiểu luận chuyên ngành</a>
                  <a href="#" onClick={() => handleDropdownClick('Đề tài của tôi', 'Khóa luận tốt nghiệp')}>Khóa luận tốt nghiệp</a>
                </div>
              </div>
            </div>
          </div>
          <div className='context-nd' style={{ marginTop: '30px' }}>
            <div className="form-title">
              <span>{selectedTitle.title1}</span>
              <hr className="line" />
            </div>
            <div className='card-nd' style={{display:'block'}}>
              <div className='title-nd'>{selectedTitle.title2}</div>
              <div className='table-items'>
                {selectedTitle.table}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MannageHead;
