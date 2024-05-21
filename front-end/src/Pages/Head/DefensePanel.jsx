import React from 'react'
import SidebarHead from '../../components/Sidebar/SidebarHead'
import Navbar from '../../components/Navbar/Navbar'
import './HomeHead.scss'
import { useEffect } from 'react'
import DataTableTopicSuccess from '../../components/TableOfHead/DefensePanel/DataTableTopicSuccess'

function DefensePanel() {
    useEffect(() => {
        document.title = "Lập hội đồng";
    }, []);
    return (
        <div className='homeHead'>
            <SidebarHead />
            <div className='context'>
                <Navbar></Navbar>
                <hr></hr>
                <div className='context-menu'>
                    <div className='context-title'>
                        <h3 className='title-re'>HỘI ĐỒNG BÁO CÁO</h3>
                    </div>
                    <DataTableTopicSuccess/>
                </div>
            </div>
        </div>
    )
}

export default DefensePanel