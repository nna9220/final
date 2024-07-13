import React, { useState, useEffect } from 'react';
import './styleRegis.scss'
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    const formatDate = (milliseconds) => {
        const date = new Date(milliseconds);
    
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }; 

    useEffect(() => {
        if (periods.length > 0) {
            // Lấy thời gian hiện tại bằng mili giây từ Epoch
            const currentDateTime = Date.now();
            const formattedCurrentDateTime = formatDate(currentDateTime);
    
            // Tìm kỳ hạn hiện tại
            const currentPeriod = periods.find(period => {
                const startTime = (period.registrationTimeStart);
                const endTime = (period.registrationTimeEnd);
                console.log("start: ",startTime);
                console.log("end: ",endTime); 
                return formattedCurrentDateTime >= startTime && formattedCurrentDateTime <= endTime;
                

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
        console.log("data add: ", formData);
        const userToken = getTokenFromUrlAndSaveToStorage();
        axiosInstance.post('/head/subject/register',
            formData, 
            {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(response => {
                if (response.status === 201) {
                    toast.success("Đăng ký đề tài thành công. Vui lòng chờ TBM duyệt đề tài!");
                    reloadForm();
                } else if (response.status === 200) {
                    toast.warning("Không trong thời gian đăng ký đề tài hoặc quá hạn đăng ký!");
                } else if (response.status === 400) {
                    toast.error("Đăng ký đề tài thất bại! Giảng viên không tồn tại.");
                } else if (response.status === 403) {
                    toast.error("Không đủ quyền để đăng ký đề tài!");
                } else {
                    toast.error("Đăng ký đề tài thất bại!");
                }
            })
            .catch(error => {
                console.error(error);
                toast.error("Đăng ký đề tài thất bại!");
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

    const handleChange = (name, selectedOption) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: selectedOption ? selectedOption.value : null
        }));
    };

    return (
        <div className='homeRegis-Head'>
            <ToastContainer />
            {currentPeriod ? (
                <div className="registration-info">
                    <h5>Đang trong đợt đăng ký: {currentPeriod.registrationName}</h5>
                    <p>Thời gian bắt đầu: {currentPeriod.registrationTimeStart}</p>
                    <p>Thời gian kết thúc: {currentPeriod.registrationTimeEnd}</p>
                </div>

            ) : (
                <>
                    <div className="alert alert-warning alert-head" role="alert">
                        <WarningOutlinedIcon /> Hiện tại không nằm trong thời gian đăng ký đề tài !!!
                    </div>
                </>
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

export default TableRegis;
