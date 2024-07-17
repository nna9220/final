import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DataTableTopicSuccess() {
    const [subjects, setSubjects] = useState([]);
    const [error, setError] = useState(null);
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [council, setCouncil] = useState();
    const [councilLecturers, setCouncilLecturers] = useState([]);
    const [councilEdit, setCouncilEdit] = useState({
        lecturer1: '',
        lecturer2: '',
        start: '',
        end: '',
        date: '',
        address: '',
    });
    const [lecturers, setLecturers] = useState([]);

    useEffect(() => {
        if (userToken) {
            loadData();
        }
    }, [userToken]);

    const loadData = async () => {
        try {
            const response = await axiosInstance.get('/head/council/listCouncil', {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            console.log(response.data);

            if (response.data.statusCodeValue === 400 && response.data.body === "Không nằm trong khoảng thời gian hội đồng được tổ chức.") {
                setError("Không nằm trong thời gian lập hội đồng");
            } else {
                setSubjects(Array.isArray(response.data.body) ? response.data.body : []);
                console.log("data: ", response.data)
                setError(null); // Clear any previous error
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setError('Đã xảy ra lỗi khi tải dữ liệu');
        }
    };

    const loadCouncilDetails = async (subjectId) => {
        try {
            console.log("ID ", subjectId)
            const response = await axiosInstance.get(`/head/council/detailCouncil/${subjectId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            const councilDetails = response.data.body.council;
            console.log("detail: ", response.data.body.councilLecturer)
            setCouncil(councilDetails);
            setCouncilLecturers(response.data.body.councilLecturer);
            setLecturers(response.data.body.listLecturer);
            setCouncilEdit({
                lecturer1: councilDetails.lecturer1?.personId || '',
                lecturer2: councilDetails.lecturer2?.personId || '',
                start: councilDetails.start || '',
                end: councilDetails.end || '',
                date: councilDetails.date || '',
                address: councilDetails.address || '',
            });
            console.log("Detail: ", response.data);
        } catch (error) {
            handleCouncilDetailError(error);
        }
    };

    const handleCouncilDetailError = (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 404:
                    console.log('Subject not found.');
                    break;
                case 417:
                    console.log('Expectation failed: Council not found for the subject.');
                    break;
                case 500:
                    console.log('Internal server error. Please try again later.');
                    break;
                default:
                    console.log('An error occurred. Please try again.');
            }
        } else if (error.request) {
            console.log('No response from the server. Please check your network.');
        } else {
            console.log('An error occurred. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCouncilEdit(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const formatTimeToSeconds = (time) => {
        if (!time) return '00:00:00';
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    };

    const formatDate = (date) => {
        if (!date) return '';
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            console.error('Invalid date value:', date);
            return '';
        }
        return format(parsedDate, 'dd/MM/yyyy');
    };

    const handleSaveChanges = async () => {
        const formattedCouncilEdit = {
            ...councilEdit,
            start: formatTimeToSeconds(councilEdit.start),
            end: formatTimeToSeconds(councilEdit.end),
            date: formatDate(councilEdit.date)
        };

        if (!formattedCouncilEdit.start || !formattedCouncilEdit.end) {
            console.error('Invalid time format for start or end.');
            return;
        }

        console.log("Send data: ", formattedCouncilEdit);
        try {
            const response = await axiosInstance.post(`/head/council/editCouncilEssay/${council.subject.subjectId}`, null, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
                params: {
                    lecturer1: formattedCouncilEdit.lecturer1,
                    lecturer2: formattedCouncilEdit.lecturer2,
                    start: formattedCouncilEdit.start,
                    end: formattedCouncilEdit.end,
                    date: formattedCouncilEdit.date,
                    address: formattedCouncilEdit.address,
                },
            });
            console.log("Save response: ", response.data);
            toast.success('Lập hội đồng thành công!');
        } catch (error) {
            console.error('Error saving council details:', error);
            toast.error('Lập hội đồng thất bại. Vui lòng thử lại.');
        }
    };

    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        if (isNaN(hours) || isNaN(minutes)) {
            return '';
        }
        return hours.padStart(2, '0') + ':' + minutes.padStart(2, '0');
    };

    return (
        <div>
            <div style={{ padding: '16px' }} className='body-table-topic'>
                {error ? (
                    <div className="alert alert-warning" style={{ border: 'none', backgroundColor: 'white', fontSize: '16px', fontWeight: 'bolder', textAlign: 'center' }} role="alert">
                        <WarningOutlinedIcon /> {error}
                    </div>
                ) : (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope='col'>Tên đề tài</th>
                                <th scope='col'>GVHD</th>
                                <th scope='col'>GVPB</th>
                                <th scope='col'>SV 1</th>
                                <th scope='col'>SV 2</th>
                                <th scope='col'>SV 3</th>
                                <th scope='col'>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(subjects) && subjects.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center">Không có dữ liệu</td>
                                </tr>
                            ) : (
                                subjects.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.subjectName}</td>
                                        <td>{item.instructorId?.person?.firstName} {item.instructorId?.person?.lastName}</td>
                                        <td>{item.thesisAdvisorId?.person?.firstName} {item.thesisAdvisorId?.person?.lastName}</td>
                                        <td>{item.student1}</td>
                                        <td>{item.student2}</td>
                                        <td>{item.student3}</td>
                                        <td>
                                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => {
                                                loadCouncilDetails(item.subjectId);
                                            }}>
                                                Lập hội đồng
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Lập hội đồng</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="date" className="form-label">Ngày</label>
                                <input type="date" className="form-control" id="date" name="date" value={councilEdit.date} onChange={handleChange} />
                            </div>

                            <div className="row mb-3">
                                <div className="col">
                                    <label htmlFor="start" className="form-label">Bắt đầu</label>
                                    <input type="time" className="form-control" id="start" name="start" value={councilEdit.start} onChange={handleChange} />
                                </div>
                                <div className="col">
                                    <label htmlFor="end" className="form-label">Kết thúc</label>
                                    <input type="time" className="form-control" id="end" name="end" value={councilEdit.end} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Địa chỉ</label>
                                <input type="text" className="form-control" id="address" name="address" value={councilEdit.address} onChange={handleChange} />
                            </div>

                            <br />

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Vai trò</th>
                                        <th>Thành viên</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>CHỦ TỊCH</td>
                                        <td>
                                            <select className="form-select" id="lecturer1" name="lecturer1" value={councilEdit.lecturer1} onChange={handleChange}>
                                                {councilLecturers.some(c => c.role === "Chủ tịch") ? (
                                                    (() => {
                                                        const chairperson = councilLecturers.find(c => c.role === "Chủ tịch").lecturer;
                                                        return (
                                                            <option key={chairperson.personId} value={chairperson.personId}>
                                                                {chairperson.person.firstName} {chairperson.person.lastName}
                                                            </option>
                                                        );
                                                    })()
                                                ) : (
                                                    <option value="">Chọn giảng viên</option>
                                                )}
                                                {lecturers.map((lecturer) => (
                                                    <option key={lecturer.personId} value={lecturer.personId}>
                                                        {lecturer.person.firstName} {lecturer.person.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>THƯ KÝ</td>
                                        <td>
                                            <select className="form-select" id="lecturer2" name="lecturer2" value={councilEdit.lecturer2} onChange={handleChange}>
                                            {councilLecturers.some(c => c.role === "Ủy viên") ? (
                                                    (() => {
                                                        const chairperson = councilLecturers.find(c => c.role === "Ủy viên").lecturer;
                                                        return (
                                                            <option key={chairperson.personId} value={chairperson.personId}>
                                                                {chairperson.person.firstName} {chairperson.person.lastName}
                                                            </option>
                                                        );
                                                    })()
                                                ) : (
                                                    <option value="">Chọn giảng viên</option>
                                                )}
                                                {lecturers.map((lecturer) => (
                                                    <option key={lecturer.personId} value={lecturer.personId}>
                                                        {lecturer.person.firstName} {lecturer.person.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    {councilLecturers.filter((member) => member.role === 'THÀNH VIÊN').map((member, index) => (
                                        <tr key={index}>
                                            <td>THÀNH VIÊN</td>
                                            <td>
                                                <select className="form-select" value={member.personId} disabled>
                                                    <option value={member.personId}>
                                                        {member.person.firstName} {member.person.lastName}
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSaveChanges}>Lưu</button>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}

export default DataTableTopicSuccess;
