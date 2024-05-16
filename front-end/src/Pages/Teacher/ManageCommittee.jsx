import React from 'react'
import SidebarLec from '../../components/Sidebar/SidebarLec'
import Navbar from '../../components/Navbar/Navbar'
import TopicPBTable from '../../components/TableOfLecturer/TopicPBTable'
import './ManageTopicPB.scss'
import { useEffect, useState } from 'react'
import TopicPBKLTable from '../../components/TableOfLecturer/TopicPBKLTable'
import CommitteeTable from '../../components/TableOfLecturer/CommitteeOfLecturer/CommitteeTable'
import CommitteeKLTable from '../../components/TableOfLecturer/CommitteeOfLecturer/CommitteeKLTable'
function ManageCommittee() {
    useEffect(() => {
        document.title = "Hội đồng báo cáo";
    }, []);
    const [selectedTitle, setSelectedTitle] = useState("Tiểu luận chuyên ngành");

    const handleDropdownChange = (e) => {
        setSelectedTitle(e.target.value);
    };
    return (
        <div className='homeHead'>
            <SidebarLec />
            <div className='context'>
                <Navbar></Navbar>
                <hr></hr>
                <div className='context-menu'>
                    <div className='context-title'>
                        <div className='title-re'>
                            <h3>HỘI ĐỒNG BÁO CÁO</h3>
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
                                {selectedTitle === "Tiểu luận chuyên ngành" ? <CommitteeTable /> : <CommitteeKLTable />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageCommittee