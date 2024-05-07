import React, { useState, useEffect } from 'react';
import SidebarHead from '../../components/Sidebar/SidebarHead';
import Navbar from '../../components/Navbar/Navbar';
import './MannageHead.scss';
import TableApprove from '../../components/TableOfHead/ApproveTable/TableApprove';
import TableApproveKL from '../../components/TableOfHead/ApproveTable/TableApproveKL';
import TableApproveBeforePB from '../../components/TableOfHead/ApproveBeforePB/TableApproveBeforePB';
import TableApproveBeforePBKL from '../../components/TableOfHead/ApproveBeforePB/TableApproveBeforePBKL';

function ManagementTopicBeforePB() {
    useEffect(() => {
        document.title = "Duyệt đề tài trước phản biện";
    }, []);

    const [selectedTitle, setSelectedTitle] = useState("Tiểu luận chuyên ngành");

    const handleDropdownChange = (e) => {
        setSelectedTitle(e.target.value);
    };

    return (
        <div className='homeHead'>
            <SidebarHead />
            <div className='context'>
                <Navbar></Navbar>
                <hr></hr>
                <div className='context-menu'>
                    <div className='context-title'>
                        <h3 className='title-re'>DUYỆT ĐỀ TÀI TRƯỚC PHẢN BIỆN</h3>
                    </div>
                    <div className='context-nd'>
                        <div className='card-nd'>
                            <label htmlFor="selectTitle"style={{marginTop:'20px', marginLeft:'30px'}}>Chọn loại đề tài</label>
                            <div className="dropdown">
                                <select id="selectTitle" className="form-se" aria-label="Default select example" onChange={handleDropdownChange}>
                                    <option className='optionSe' value="Tiểu luận chuyên ngành">Tiểu luận chuyên ngành</option>
                                    <option className='optionSe' value="Khóa luận tốt nghiệp">Khóa luận tốt nghiệp</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='table-nd'>
                        <div className="form-title">
                            <span>{selectedTitle}</span>
                            <hr className="line" />
                        </div>
                        <div className='body-tableAss'>
                            {selectedTitle === "Tiểu luận chuyên ngành" ? <TableApproveBeforePB /> : <TableApproveBeforePBKL />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagementTopicBeforePB