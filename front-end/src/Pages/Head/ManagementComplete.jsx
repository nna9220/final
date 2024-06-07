import React from 'react'
import CompleteTopic from '../../components/TableOfHead/CompleteTopic/CompleteTopic';
import CompleteTopicKL from '../../components/TableOfHead/CompleteTopic/CompleteTopicKL';
import Navbar from '../../components/Navbar/Navbar'
import { useEffect, useState, useContext } from 'react'
import SidebarHead from '../../components/Sidebar/SidebarHead';
import { NotificationContext } from './NotificationContext';

function ManagementComplete() {
    useEffect(() => {
        document.title = "Đề tài đã thực hiện";
    }, []);
    const [selectedTitle, setSelectedTitle] = useState("Tiểu luận chuyên ngành");
    const { notifications, unreadCount } = useContext(NotificationContext);

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
                            <h3>ĐỀ TÀI ĐÃ THỰC HIỆN</h3>
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
                        <div className='card-nd-topicPB' style={{ display: 'block' }}>
                            <div className='table-items-topicPB'>
                                {selectedTitle === "Tiểu luận chuyên ngành" ? <CompleteTopic /> : <CompleteTopicKL />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagementComplete