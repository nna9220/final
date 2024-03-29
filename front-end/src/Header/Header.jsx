import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import './header.scss';

const Navbar = () => {
    const [menu, setMenu] = useState("home");

    const handleLoginClick = () => {
        window.location.href = 'http:/hcmute.workon.space//oauth2/authorization/google';
    };

    return (
        <div>
            <header class="header">
                <div class="logo">
                    <img onClick={() => { setMenu("home") }} src="/assets/logo-lv1.png" /> {menu === "home" ? <h /> : <></>}
                </div>
                <nav class="navigation">
                    <ul>
                        <li><a>
                            <NavLink to="/">Trang chủ</NavLink> {menu === "home" ? <h /> : <></>}
                        </a></li>
                        <li><a>
                            <NavLink to="/info-teacher">Giảng viên</NavLink> {menu === "teachers" ? <h /> : <></>}                            </a></li>
                        <li><a>
                            <NavLink to="/contact">Liên hệ</NavLink> {menu === "contact" ? <h /> : <></>}
                        </a></li>
                    </ul>
                </nav>
                <div class="login-button">
                    <button className="btn" onClick={handleLoginClick}>
                        <i className="fab fa-google-plus-g"></i> Đăng nhập
                    </button>
                </div>
            </header>
        </div>
    )
};

export default Navbar;