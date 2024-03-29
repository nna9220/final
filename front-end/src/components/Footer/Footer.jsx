import React from 'react'
import { NavLink } from 'react-router-dom';
import './footer.scss'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhonelinkRingOutlinedIcon from '@mui/icons-material/PhonelinkRingOutlined';

function Footer() {
    return (
        <div>
            <footer className="footer">
                <div className="footer-content">
                    {/* Phần logo */}
                    <div className="footer-logo">
                        <img src="/assets/logo-lv2-1.png" alt="Footer Logo" />
                    </div>
                    {/* Phần thông tin liên hệ */}
                    <div className="footer-contact-info">
                        <h3>THÔNG TIN LIÊN HỆ</h3>
                        <p><BusinessOutlinedIcon className="icon"/> Địa chỉ: Số 1 Võ Văn Ngân, phường Linh Chiểu, TP.Thủ Đức, TP. Hồ Chí Minh</p>
                        <p><EmailOutlinedIcon className="icon"/> Email: saudaihoc@hcmute.edu.vn</p>
                        <p><PhonelinkRingOutlinedIcon className="icon"/> Điện thoại: (+84.28) 37225766 hoặc 37221223 (số nội bộ 8125)</p>
                    </div>
                    {/* Phần quick link */}
                    <div className="footer-quick-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a ><NavLink className='link' to="/">Trang chủ</NavLink></a></li>
                            <li><a ><NavLink className='link' to="/info-teacher">Giảng viên</NavLink></a></li>
                            <li><a ><NavLink className='link' to="/contact">Liên hệ</NavLink></a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer