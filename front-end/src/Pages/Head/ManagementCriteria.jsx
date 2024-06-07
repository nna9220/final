import React, { useState, useEffect, useContext} from 'react';
import SidebarHead from '../../components/Sidebar/SidebarHead';
import Navbar from '../../components/Navbar/Navbar';
import './MannageHead.scss';
import TableAssign from '../../components/TableOfHead/AssignTable/TableAssign';
import TableAssignKL from '../../components/TableOfHead/AssignTable/TableAssignKL';
import CriteriaForTL from '../../components/TableOfHead/CriteriaTable/CriteriaForTL';
import CriteriaForKL from '../../components/TableOfHead/CriteriaTable/CriteriaForKL';
import { NotificationContext } from './NotificationContext';

function ManagementCriteria() {
    useEffect(() => {
        document.title = "Tiêu chí phản biện";
      }, []);
      const { notifications, unreadCount } = useContext(NotificationContext);
      const [selectedTitle, setSelectedTitle] = useState("Tiểu luận chuyên ngành");
    
      const handleDropdownChange = (e) => {
        setSelectedTitle(e.target.value);
      };
    
      return (
        <div className='homeHead'>
          <SidebarHead />
          <div className='context'>
          <Navbar unreadCount={unreadCount} />
            <hr></hr>
            <div className='context-menu'>
              <div className='context-title'>
                <div className='title-re'>
                  <h3>TIÊU CHÍ PHẢN BIỆN</h3>
                </div>
              </div>
              <div className='context-nd'>
                <div className='card-nd'>
                  <label htmlFor="selectTitle" style={{ marginTop: '20px', marginLeft: '30px' }}>Chọn loại đề tài</label>
                  <div className="dropdown">
                    <select id="selectTitle" className="form-se" aria-label="Default select example" onChange={handleDropdownChange}>
                      <option className='optionSe' value="Tiểu luận chuyên ngành">Tiểu luận chuyên ngành</option>
                      <option className='optionSe' value="Khóa luận tốt nghiệp">Khóa luận tốt nghiệp</option>
                    </select>
                  </div>
                </div>
              </div>
    
              <div className='context-nd' style={{ marginTop: '30px' }}>
                <div className="form-title">
                  <span>{selectedTitle}</span>
                  <hr className="line" />
                </div>
                <div className='card-nd-assign'>
                  <div className='table-items'>
                    {selectedTitle === "Tiểu luận chuyên ngành" ? <CriteriaForTL /> : <CriteriaForKL/>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
}

export default ManagementCriteria