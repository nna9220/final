import React, {useEffect} from 'react'
import SidebarAdmin from '../../components/Sidebar/SidebarAdmin';
import Navbar from '../../components/Navbar/Navbar';
import DatatableContact from '../../components/dataTable/DatatableContact';

export default function ManagementContact() {
    useEffect(() => {
        document.title = "Thắc mắc - Liên hệ";
    }, []);
    return (
        <div>
            <div className='manaStudentOfAdmin'>
                <SidebarAdmin />
                <div className="homeContainer">
                    <Navbar />
                    <hr />
                    <div className="widgets-class">
                        <div className='headMana-class'>
                            <div className='titleMana-class'>
                                <h5>Thắc mắc - Liên hệ</h5>
                            </div>
                        </div>
                        <div className='homeMana-class'>
                            <DatatableContact/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
