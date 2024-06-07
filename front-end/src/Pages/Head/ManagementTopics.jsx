import React, { useState, useEffect, useContext } from 'react';
import SidebarHead from '../../components/Sidebar/SidebarHead';
import Navbar from '../../components/Navbar/Navbar';
import './MannageHead.scss';
import TableTopic from '../../components/TableOfHead/TopicOfHead/TableTopic';
import TableTopicKL from '../../components/TableOfHead/TopicOfHead/TableTopicKL';
import { NotificationContext } from './NotificationContext';


function ManagementProjects() {
    useEffect(() => {
        document.title = "Đề tài của tôi";
      }, []);
    
      const [selectedTitle, setSelectedTitle] = useState("Tiểu luận chuyên ngành");
    
      const handleDropdownChange = (e) => {
        setSelectedTitle(e.target.value);
      };
      const { notifications, unreadCount } = useContext(NotificationContext);

      return (
        <div className='homeHead'>
            <SidebarHead />
            <div className='context'>
            <Navbar unreadCount={unreadCount} />
                <hr></hr>
                <div className='context-menu'>
                    <div className='context-title'>
                        <div className='title-re'>
                            <h3>ĐỀ TÀI CỦA TÔI</h3>
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
                        <div className='card-nd-topic' style={{ display: 'block' }}>
                            <div className='table-items'>
                                {selectedTitle === "Tiểu luận chuyên ngành" ? <TableTopic /> : <TableTopicKL />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagementProjects