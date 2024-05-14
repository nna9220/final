import React, { useState, useEffect } from 'react';
import './styleRegis.scss'
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import { Toast } from 'react-bootstrap';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import axiosInstance from '../../../API/axios';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';

function TableRegis() {
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
    const [students, setStudents] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [currentPeriod, setCurrentPeriod] = useState(null);

    useEffect(() => {
        loadStudents();
        getPeriod();
    }, []);

    useEffect(() => {
        if (periods.length > 0) {
            const currentDate = new Date();
            const currentDateTime = currentDate.getTime(); 
            const currentPeriod = periods.find(period => {
                const startTime = convertStringToDate(period.registrationTimeStart).getTime();
                const endTime = convertStringToDate(period.registrationTimeEnd).getTime();
                return currentDateTime <= startTime && currentDateTime >= endTime;
            });
            setCurrentPeriod(currentPeriod);
            console.log("Thời gian hiện tại: ", currentDateTime);
        }
    }, [periods]);
    
    function convertStringToDate(dateTimeString) {
        const [datePart, timePart] = dateTimeString.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hour, minute, second] = timePart.split(':');
        return new Date(year, month - 1, day, hour, minute, second);
    }

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

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        const userToken = getTokenFromUrlAndSaveToStorage();
        axiosInstance.post('/head/subject/register',
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

    const loadStudents = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        axiosInstance.get('/head/subject/listStudent', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log('Danh sách sinh viên:', response.data);
                setStudents(response.data);
            })
            .catch(error => {
                console.error(error);
                console.log("Lỗi");
            });
    };

    const getPeriod = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        if (userToken) {
            axiosInstance.get('/head/subject/periodHead', {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            })
                .then(response => {
                    console.log('Danh sách đợt đề tài:', response.data);
                    setPeriods(response.data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    console.log("Lỗi");
                });
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className='homeRegis-Head'>
            {currentPeriod ? (
                <div>
                    <h3>Đang trong đợt đăng ký: {currentPeriod.registrationName}</h3>
                    <p>Thời gian bắt đầu: {currentPeriod.registrationTimeEnd}</p>
                    <p>Thời gian kết thúc: {currentPeriod.registrationTimeStart}</p>
                </div>
            ) : (
                <>
                    <div className="alert alert-warning alert-head" role="alert">
                        <WarningOutlinedIcon /> Hiện tại không nằm trong thời gian đăng ký đề tài !!!
                    </div>
                </>
            )}

            <Toast show={showAddToast} style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto">Thông báo</strong>
                </Toast.Header>
                <Toast.Body>
                    Đăng ký đề tài thành công! Nhấn vào <button style={{ border: 'none', backgroundColor: 'green', color: 'white' }} onClick={reloadForm}><CheckOutlinedIcon /></button> để xác nhận.
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
            <div className='menuItems'>
                {currentPeriod && (
                    <>
                        <div className='title'>
                            <h3>ĐĂNG KÝ ĐỀ TÀI</h3>
                        </div>
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
                    </>
                )}
            </div>
        </div>
    );
}

export default TableRegis;