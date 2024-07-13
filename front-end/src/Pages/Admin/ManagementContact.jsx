import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar';
import DatatableContact from '../../components/dataTable/DatatableContact';
import Sidebar from '../../components/Sidebar/SidebarAdmin';

export default function ManagementContact() {
    useEffect(() => {
        document.title = "Thắc mắc - Liên hệ";
    }, []);
    return (
        <div>
            <div style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}/assets/bg-admin.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh'
            }} className='manaStudentOfAdmin'>
                <Sidebar style={{ backgroundColor: 'white' }} />
                <div className="homeContainer">
                    <Navbar />
                    <hr />
                    <div className="widgets">
                        <div className='headMana-class'>
                            <div className='titleMana-class'>
                                <h5>GIẢI ĐÁP - LIÊN HỆ</h5>
                            </div>
                        </div>
                        <div style={{
                            marginTop: '20px',
                            marginRight: '20px',
                            marginBottom: '20px',
                            backgroundColor: 'white',
                            width: '100%',
                            height: '100%',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}>
                            <div style={{ flex: 1, overflow: 'auto' }}>
                                <DatatableContact />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
