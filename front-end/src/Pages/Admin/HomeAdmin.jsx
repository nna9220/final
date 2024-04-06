import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/SidebarAdmin';
import Context from '../../components/Context/Context';
import './HomeAdmin.scss';


function HomeAdmin() {
    const [isSidebarClosed, setSidebarClosed] = useState(false);

    return (
        <div className="HomeAdmin">
            <Sidebar />
            <div className='homeContainer'>
                <Navbar />
                <hr />
                <div className='widgets'>
                    <Context />
                </div>
            </div>
        </div>
    );
}

export default HomeAdmin;
