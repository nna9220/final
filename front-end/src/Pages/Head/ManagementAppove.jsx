import React, { useState, useEffect, useContext} from 'react';
import SidebarHead from '../../components/Sidebar/SidebarHead';
import Navbar from '../../components/Navbar/Navbar';
import './MannageHead.scss';
import TableApprove from '../../components/TableOfHead/ApproveTable/TableApprove';
import TableApproveKL from '../../components/TableOfHead/ApproveTable/TableApproveKL';
import { NotificationContext } from './NotificationContext';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import { Navigate} from 'react-router-dom';

function ManagementAppove() {
    useEffect(() => {
        document.title = "Duyệt đề tài";
    }, []);
    const { notifications, unreadCount } = useContext(NotificationContext);

    const [selectedTitle, setSelectedTitle] = useState("Tiểu luận chuyên ngành");

    const handleDropdownChange = (e) => {
        setSelectedTitle(e.target.value);
    };

    const [authorized, setAuthorized] = useState(true);

    useEffect(() => {
        const checkAuthorization = async () => {
            const userToken = getTokenFromUrlAndSaveToStorage(); // Lấy token từ URL hoặc từ bất kỳ nguồn nào khác
            if (userToken) {
                try {
                    // Gửi token đến backend để kiểm tra quyền truy cập
                    const response = await axiosInstance.post('/admin/check-authorization/head', { token: userToken });
                    if (response.data.authorized) {
                        // Nếu có quyền truy cập, setAuthorized(true)
                        setAuthorized(true);
                    } else {
                        // Nếu không có quyền truy cập, setAuthorized(false) và chuyển hướng đến trang không được ủy quyền
                        setAuthorized(false);
                    }
                } catch (error) {
                    console.error("Error checking authorization:", error);
                }
            } else {
                // Nếu không có token, setAuthorized(false) và chuyển hướng đến trang không được ủy quyền
                setAuthorized(false);
            }
        };

        checkAuthorization();
    }, []);

    if (!authorized) {
        return <Navigate to="/" />;
    }
    
    return (
        <div className='homeHead'>
            <SidebarHead />
            <div className='context'>
            <Navbar unreadCount={unreadCount} />
                <hr></hr>
                <div className='context-menu'>
                    <div className='context-title'>
                        <h3 className='title-re'>DUYỆT ĐỀ TÀI</h3>
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
                            {selectedTitle === "Tiểu luận chuyên ngành" ? <TableApprove /> : <TableApproveKL />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagementAppove