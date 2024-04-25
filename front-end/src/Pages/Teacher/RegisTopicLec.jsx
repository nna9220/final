import React from 'react'
import SidebarLec from '../../components/Sidebar/SidebarLec'
import Navbar from '../../components/Navbar/Navbar'
import './RegisTopicLec.scss'
import RegisTopicOfLecturer from '../../components/Table/RegisTopicOfLecturer'
import { useState, useEffect } from 'react'
import RegisTopicOfLecturerKL from '../../components/Table/RegisTopicOfLecturerKL'

function RegisTopicLec() {
  useEffect(() => {
    document.title = "Đăng ký đề tài";
  }, []);
  const [selectedTitle, setSelectedTitle] = useState("Tiểu luận chuyên ngành");

  const handleDropdownClick = (title1, title2, table) => {
    setSelectedTitle({ title1, title2, table });
  };

  const handleDropdownChange = (e) => {
    setSelectedTitle(e.target.value);
  };


  return (
    <div className='homeLec'>
      <SidebarLec></SidebarLec>
      <div className='context'>
        <Navbar />
        <hr />
        <div className='context-menu'>
          <div className='contaxt-title'>
            <div className='title-re'>
              <h3>ĐĂNG KÝ ĐỀ TÀI</h3>
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
            <div className='card-nd' style={{ display: 'block' }}>
              <div className='table-items'>
                {selectedTitle === "Tiểu luận chuyên ngành" ? <RegisTopicOfLecturer /> : <RegisTopicOfLecturerKL />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisTopicLec