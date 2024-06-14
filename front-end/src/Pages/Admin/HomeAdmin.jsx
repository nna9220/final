import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/SidebarAdmin';
import Context from '../../components/Context/Context';
import './HomeAdmin.scss';
import Chatbot from '../../components/ChatBot/Chatbot';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../../API/axios';
import NotificationOfAdmin from '../../components/Notification/NotificationOfAdmin';
function HomeAdmin() {
    useEffect(() => {
        document.title = "Trang chủ Amdin"
    })
    return (
        <div className="HomeAdmin">
            <Sidebar />
            <div className='homeContainer'>
                <Navbar />
                <hr />
                <div className='widgets'>
                    <div className='headMana-class'>
                        <div className='titleMana-class'>
                            <h5>Trang chủ</h5>
                        </div>
                    </div>
                    <div className='homeMana-class'>
                        <Context />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeAdmin;
