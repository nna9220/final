import React from 'react'
import SidebarLec from '../../components/Sidebar/SidebarLec'
import Navbar from '../../components/Navbar/Navbar'
import TopicPBTable from '../../components/Table/TopicPBTable'
import './ManageTopicPB.scss'
import { useEffect } from 'react'
function ManageTopicPB() {
    useEffect(() => {
        document.title = "Quản lý đề tài phản biện";
      }, []);
    return (
        <div className='homeLec'>
            <SidebarLec></SidebarLec>
            <div className='context'>
                <Navbar />
                <hr></hr>
                <h3 className='title-pb'>QUẢN LÝ ĐỀ TÀI PHẢN BIỆN</h3>
                <div className='body-table'>
                    <TopicPBTable />
                </div>
            </div>
        </div>
    )
}

export default ManageTopicPB