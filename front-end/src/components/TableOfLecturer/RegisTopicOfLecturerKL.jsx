import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RegisTopicOfLecturer.scss'
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Toast } from 'react-bootstrap';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axiosInstance from "../../API/axios";
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import AlarmOnOutlinedIcon from '@mui/icons-material/AlarmOnOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [students, setStudents] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [currentPeriod, setCurrentPeriod] = useState(null);

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
        getPeriod();
    }, []);

    useEffect(() => {
        if (periods.length > 0) {
            const currentDate = new Date();
            const currentDateTime = currentDate.getTime(); // Chuyển đổi thành timestamp để so sánh dễ dàng hơn
            const currentPeriod = periods.find(period => {
                const startTime = convertStringToDate(period.registrationTimeStart).getTime();
                const endTime = convertStringToDate(period.registrationTimeEnd).getTime();
                return currentDateTime >= startTime && currentDateTime <= endTime;
            });
            setCurrentPeriod(currentPeriod);
            console.log("Thời gian hiện tại: ", currentDateTime);
        }
    }, [periods]);

    // Hàm chuyển đổi từ xâu kí tự sang đối tượng Date
    function convertStringToDate(dateTimeString) {
        const [datePart, timePart] = dateTimeString.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hour, minute, second] = timePart.split(':');
        // Chú ý rằng month - 1 vì tháng trong JavaScript bắt đầu từ 0
        return new Date(year, month - 1, day, hour, minute, second);
    }

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

    const getPeriod = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        if (userToken) {
            axiosInstance.get('/lecturer/subjectGraduation/periodLecturer', {
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
                toast.success("Đăng ký đề tài thành công. Vui lòng chờ duyệt!")
                reloadForm();
            })
            .catch(error => {
                console.error(error);
                console.log("Lỗi");
                toast.error("Đăng ký đề tài thất bại!");
                setShowErrorToastAdd(true);
            });
    };

    const handleChange = (name, selectedOption) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: selectedOption ? selectedOption.value : null
        }));
    };

    return (
        <div className='homeRegis'>
            <ToastContainer />
            {currentPeriod ? (
                <div className='informationPeriod'>
                    <h5 className='namePeriod'>Đợt đăng ký: {currentPeriod.registrationName}</h5>
                    <p className='timePeriod'><AlarmOnOutlinedIcon /> Bắt đầu: {currentPeriod.registrationTimeStart}</p>
                    <p className='timePeriod'><HourglassEmptyOutlinedIcon /> Kết thúc: {currentPeriod.registrationTimeEnd}</p>
                </div>
            ) : (
                <div className="alert alert-warning alert-lecturer" role="alert">
                    <WarningOutlinedIcon /> Hiện tại không nằm trong thời gian đăng ký đề tài !!!
                </div>
            )}
            <div className='menuItems'>
                {currentPeriod && (
                    <>
                        <div className='title'>
                            <h3>ĐĂNG KÝ ĐỀ TÀI</h3>
                        </div>
                        <div className='form-Register' onSubmit={handleSubmitAdd}>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="subjectName" className="form-label">Tên đề tài</label>
                                    <input required type="text" className="form-control" id="subjectName" name="subjectName" value={formData.subjectName} onChange={(e) => handleChange('subjectName', e.target)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="requirement" className="form-label">Yêu cầu</label>
                                    <textarea required type="text" className="form-control" id="requirement" name="requirement" value={formData.requirement} onChange={(e) => handleChange('requirement', e.target)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="expected" className="form-label">Kết quả mong muốn</label>
                                    <textarea required type="text" className="form-control" id="expected" name="expected" value={formData.expected} onChange={(e) => handleChange('expected', e.target)} />
                                </div>
                                <h5>Nhóm sinh viên thực hiện:</h5>
                                <div className="mb-3">
                                    <label htmlFor="student1" className="form-label">Sinh viên 1</label>
                                    <Select
                                        options={students.map(student => ({
                                            value: student.studentId,
                                            label: `${student.studentId} - ${student.person?.firstName} ${student.person?.lastName}`
                                        }))}
                                        value={students.find(student => student.studentId === formData.student1) ? {
                                            value: formData.student1,
                                            label: `${formData.student1} - ${students.find(student => student.studentId === formData.student1).person?.firstName} ${students.find(student => student.studentId === formData.student1).person?.lastName}`
                                        } : null}
                                        onChange={(selectedOption) => handleChange('student1', selectedOption)}
                                        isClearable
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="student2" className="form-label">Sinh viên 2</label>
                                    <Select
                                        options={students.map(student => ({
                                            value: student.studentId,
                                            label: `${student.studentId} - ${student.person?.firstName} ${student.person?.lastName}`
                                        }))}
                                        value={students.find(student => student.studentId === formData.student2) ? {
                                            value: formData.student2,
                                            label: `${formData.student2} - ${students.find(student => student.studentId === formData.student2).person?.firstName} ${students.find(student => student.studentId === formData.student2).person?.lastName}`
                                        } : null}
                                        onChange={(selectedOption) => handleChange('student2', selectedOption)}
                                        isClearable
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="student3" className="form-label">Sinh viên 3</label>
                                    <Select
                                        options={students.map(student => ({
                                            value: student.studentId,
                                            label: `${student.studentId} - ${student.person?.firstName} ${student.person?.lastName}`
                                        }))}
                                        value={students.find(student => student.studentId === formData.student3) ? {
                                            value: formData.student3,
                                            label: `${formData.student3} - ${students.find(student => student.studentId === formData.student3).person?.firstName} ${students.find(student => student.studentId === formData.student3).person?.lastName}`
                                        } : null}
                                        onChange={(selectedOption) => handleChange('student3', selectedOption)}
                                        isClearable
                                    />
                                </div>
                                <div className='footerForm'>
                                    <div>
                                        <button className="buttonRegister" type="submit">Đăng ký</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default RegisTopicOfLecturerKL;