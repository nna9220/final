import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RegisTopicOfLecturer.scss'
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Toast } from 'react-bootstrap';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axiosInstance from "../../API/axios";

function RegisTopicOfLecturerKL() {
    const [isLoading, setIsLoading] = useState(false);
    const [showAddToast, setShowAddToast] = useState(false);
    const [showErrorToastAdd, setShowErrorToastAdd] = useState(false);
    const [formData, setFormData] = useState({
        subjectName: '',
        requirement: '',
        expected: '',
        student1: null,
        student2: null,
        student3: null,
    });
    const [students, setStudents]= useState([]);

    const handleSubmitAdd = (event) => {
        event.preventDefault();
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log(formData)
        axiosInstance.post('/lecturer/subjectGraduation/register',
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

    const reloadForm = () => {
        setFormData({
            subjectName: '',
            requirement: '',
            expected: '',
            student1: null,
            student2: null,
            student3: null,
        });
        setShowAddToast(false);
    };

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        axiosInstance.get('/lecturer/subjectGraduation/listStudent', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
        .then(response => {
            console.log('Danh sách sinh viên:', response.data);
            setStudents(response.data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error(error);
            console.log("Lỗi");
        });
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
                <h3>ĐĂNG KÝ ĐỀ TÀI- KHÓA LUẬN TỐT NGHIỆP</h3>
            </div>
            <div className='menuItems'>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <form action="/action_page.php" class="was-validated">
                        <div class="mb-3 mt-3">
                            <label for="subjectName" class="form-label">Tên đề tài:</label>
                            <input type="text" class="form-control" id="subjectName" placeholder="Nhập tên đề tài" name="subjectName" value={formData.subjectName} onChange={handleChange} required />
                            <div class="valid-feedback">Valid.</div>
                            <div class="invalid-feedback">Vui lòng nhập tên đề tài.</div>
                        </div>
                        <div class="mb-3 mt-3">
                            <label for="requirement" class="form-label">Yêu cầu:</label>
                            <input type="text" class="form-control" id="requirement" placeholder="Nhập tên đề tài" name="requirement" value={formData.requirement} onChange={handleChange} required />
                            <div class="valid-feedback">Valid.</div>
                            <div class="invalid-feedback">Vui lòng nhập yêu cầu cho đề tài.</div>
                        </div>
                        <div class="mb-3 mt-3">
                            <label for="expected" class="form-label">Kết quả mong muốn:</label>
                            <input type="text" class="form-control" id="expected" placeholder="Nhập tên đề tài" name="expected" value={formData.expected} onChange={handleChange} required />
                            <div class="valid-feedback">Valid.</div>
                            <div class="invalid-feedback">Vui lòng nhập kết quả mong muốn.</div>
                        </div>   
                        <h5>Nhóm sinh viên thực hiện: </h5>
                        <div className="mb-3">
                            <label htmlFor="student1" className="form-label">Sinh viên 1</label>
                            <select className="form-select" aria-label="Default select example" name="student1" value={formData.student1} onChange={handleChange}>
                                <option selected disabled>Chọn sinh viên</option>
                                {students.map(student => (
                                    <option key={student.id} value={student.studentId}>{student.person?.firstName + ' ' + student.person?.lastName}</option>
                                ))}
                            </select>                        
                        </div>
                        <div className="mb-3">
                            <label htmlFor="student2" className="form-label">Sinh viên 2</label>
                            <select className="form-select" aria-label="Default select example" name="student2" value={formData.student2} onChange={handleChange}>
                                <option selected disabled>Chọn sinh viên</option>
                                {students.map(student => (
                                    <option key={student.id} value={student.studentId}>{student.person?.firstName + ' ' + student.person?.lastName}</option>
                                ))}
                            </select>                           
                        </div>
                        <div className="mb-3">
                            <label htmlFor="student3" className="form-label">Sinh viên 3</label>
                            <select className="form-select" aria-label="Default select example" name="student3" value={formData.student3} onChange={handleChange}>
                                <option selected disabled>Chọn sinh viên</option>
                                {students.map(student => (
                                    <option key={student.id} value={student.studentId}>{student.person?.firstName + ' ' + student.person?.lastName}</option>
                                ))}
                            </select>   
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

export default RegisTopicOfLecturerKL