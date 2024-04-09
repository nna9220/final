import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RegisTopicOfLecturer.scss'
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Toast } from 'react-bootstrap';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

function RegisTopicOfLecturer() {
    const [isLoading, setIsLoading] = useState(false);
    const [showAddToast, setShowAddToast] = useState(false);
    const [showErrorToastAdd, setShowErrorToastAdd] = useState(false);
    const [formData, setFormData] = useState({
        subjectName: '',
        requirement: '',
        expected: '',
        student1: '',
        student2: '',
    });

    const handleSubmitAdd = (event) => {
        event.preventDefault();
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log(formData)
        axios.post('/api/lecturer/subject/register',
            formData
            , {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(response => {
                console.log('Đề tài đã được tạo thành công:', response.data);
                setShowAddToast(true);          
            })
            .catch(error => {
                console.error(error);
                console.log("Lỗi");
                setShowErrorToastAdd(true);
            });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className='homeRegis'>
            <Toast show={showAddToast} onClose={() => setShowAddToast(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto">Thông báo</strong>
                </Toast.Header>
                <Toast.Body>
                    <DoneOutlinedIcon /> Đăng ký đề tài thành công!
                </Toast.Body>
            </Toast>

            <Toast show={showErrorToastAdd} onClose={() => setShowErrorToastAdd(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto" style={{ color: 'red' }}><ErrorOutlineOutlinedIcon /> Lỗi</strong>
                </Toast.Header>
                <Toast.Body>
                    Đăng ký đề tài không thành công!
                </Toast.Body>
            </Toast>
            <div className='title'>
                <h3>ĐĂNG KÝ ĐỀ TÀI</h3>
            </div>
            <div className='menuItems'>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <form>
                        <div className="mb-3">
                            <label htmlFor="subjectName" className="form-label">Tên đề tài</label>
                            <input type="text" className="form-control" id="subjectName" name="subjectName" value={formData.subjectName} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="requirement" className="form-label">Yêu cầu </label>
                            <input type="text" className="form-control" id="requirement" name="requirement" value={formData.requirement} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="expected" className="form-label">Kết quả mong muốn</label>
                            <input type="text" className="form-control" id="expected" name="expected" value={formData.expected} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="major" className="form-label">Loại đề tài </label>
                            <select class="form-select" aria-label="Default select example">
                                <option selected disabled>Loại đề tài</option>
                                <option value="1">Tiểu luận chuyên ngành</option>
                                <option value="2">Khóa luận tốt nghiệp</option>
                            </select>
                        </div>
                        <h5>Nhóm sinh viên thực hiện: </h5>
                        <div className="mb-3">
                            <label htmlFor="student1" className="form-label">Sinh viên 1</label>
                            <input type="text" className="form-control" id="student1" name="student1" value={formData.student1} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="student2" className="form-label">Sinh viên 2</label>
                            <input type="text" className="form-control" id="student2" name="student2" value={formData.student2} onChange={handleChange} />
                        </div>

                        <div className='footerForm'>
                            <div>
                                <button type="submit" onClick={handleSubmitAdd}>Đăng ký</button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default RegisTopicOfLecturer