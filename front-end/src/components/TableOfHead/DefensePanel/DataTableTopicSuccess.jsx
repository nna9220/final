import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';

function DataTableTopicSuccess() {
    const [subjects, setSubjects] = useState([]);
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [council, setCouncil] = useState();
    const [councilLecturers, setCouncilLecturers] = useState([]);
    const [roles, setRoles] = useState({});
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
            setSubjects(response.data.body || []);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const loadCouncilDetails = async (subjectId) => {
        try {
            const response = await axiosInstance.get(`/head/council/detailCouncil/${subjectId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            const councilDetails = response.data.body.council;
            setCouncil(councilDetails);
            setCouncilLecturers(response.data.body.councilLecturer);
            setRoles(response.data.body.councilLecturer.reduce((acc, curr) => {
                acc[curr.lecturer.person.personId] = curr.role;
                return acc;
            }, {}));
            setLecturers (response.data.body.listLecturerOfCouncil);
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

    const handleRoleChange = (e, lecturerId) => {
        const { value } = e.target;
        setRoles(prevRoles => ({
            ...prevRoles,
            [lecturerId]: value
        }));
    };

    const handleSaveChanges = async () => {
        console.log("Send data: ", councilEdit);
        try {
            const response = await axiosInstance.post(`/head/council/editCouncilEssay/${council.subject.subjectId}`, null, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
                params: {
                    lecturer1: councilEdit.lecturer1,
                    lecturer2: councilEdit.lecturer2,
                    start: councilEdit.start,
                    end: councilEdit.end,
                    date: councilEdit.date,
                    address: councilEdit.address,
                },
            });
            console.log("Save response: ", response.data);
        } catch (error) {
            console.error('Error saving council details:', error);
        }
    };

    return (
        <div>
            <div style={{ padding: '16px' }} className='body-table-topic'>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên đề tài</th>
                            <th scope='col'>GVHD</th>
                            <th scope='col'>GVPB</th>
                            <th scope='col'>SV 1</th>
                            <th scope='col'>SV 2</th>
                            <th scope='col'>SV 3</th>
                            <th scope='col'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.length === 0 ? (
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

                            <h6>Danh sách thành viên hội đồng: </h6>
                            <div>
                                <table className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Thành viên</th>
                                            <th>Họ và tên</th>
                                            <th>Vai trò</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Thành viên 1</td>
                                            <td>
                                                <div className="mb-3">
                                                    <select className="form-control" id="lecturer1" name="lecturer1" value={councilEdit.lecturer1} onChange={handleChange}>
                                                        <option value="">Chọn giảng viên</option>
                                                        {lecturers.map((lecturer, index) => (
                                                            <option key={index} value={lecturer.lecturerId}>
                                                                {lecturer.person.firstName} {lecturer.person.lastName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                            <td>
                                                Chủ tịch
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Thành viên 2</td>
                                            <td>
                                                <div className="mb-3">
                                                    <select className="form-control" id="lecturer2" name="lecturer2" value={councilEdit.lecturer2} onChange={handleChange}>
                                                        <option value="">Chọn giảng viên</option>
                                                        {lecturers.map((lecturer, index) => (
                                                            <option key={index} value={lecturer.lecturerId}>
                                                                {lecturer.person.firstName} {lecturer.person.lastName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                            <td>
                                                Ủy viên
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>Lưu thay đổi</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataTableTopicSuccess;

