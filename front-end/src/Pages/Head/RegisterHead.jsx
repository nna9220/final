import React, { useState } from 'react';
import './RegisterHead.scss';
import SidebarHead from '../../components/Sidebar/SidebarHead';
import Navbar from '../../components/Navbar/Navbar';
import TableRegis from '../../components/TableOfHead/TableRegis';
import TableRegisKL from '../../components/TableOfHead/TableRegisKL';

function RegisterHead() {
    const [selectedTitle, setSelectedTitle] = useState("Tiểu luận chuyên ngành");

    const handleDropdownClick = (title1, title2, table) => {
        setSelectedTitle({ title1, title2, table });
      };

    const handleDropdownChange = (e) => {
        setSelectedTitle(e.target.value);
    };

    return (
        <div className='homeHead'>
            <SidebarHead />
            <div className='context'>
                <Navbar />
                <hr />
                <div className='context-menu'>
                    <div className='context-title'>
                        <div className='title-re'>
                            <h3>ĐĂNG KÝ ĐỀ TÀI</h3>
                        </div>
                    </div>
                    <div className='context-nd'>
                        <div className='card-nd'>
                            <label htmlFor="selectTitle" style={{marginTop:'20px', marginLeft:'30px'}}>Chọn loại đề tài</label>
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
                        <div className='card-nd' style={{ display: 'block' }}>
                            <div className='table-items'>
                            {selectedTitle === "Tiểu luận chuyên ngành" ? <TableRegis /> : <TableRegisKL />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterHead;
