import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import { useState, useEffect } from 'react';

function DataTableTopicSuccess() {
    const [subjects, setSubjects] = useState([]);
    const [time, setTime] = useState('');
    const [address, setAddress] = useState('');
    const [lecturer1, setLecturer1] = useState('');
    const [lecturer2, setLecturer2] = useState('');
    const [role1, setRole1] = useState('');
    const [role2, setRole2] = useState('');
    const [lecturerList, setLecturerList] = useState([]);
    const [subjectId, setSubjectId] = useState(null);
    const [defaultLecturerId, setDefaultLecturerId] = useState('');
    const userToken = getTokenFromUrlAndSaveToStorage();

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
            console.log("Council: ", response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };


    const loadCouncilDetails = async (subjectId) => {
        console.log("id", subjectId);
        console.log(userToken);
        try {
            const response = await axiosInstance.get(`/head/council/detail/${subjectId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            const councilDetails = response.data;
            setDefaultLecturerId(councilDetails.lecturer1);
            setLecturer2(councilDetails.lecturer2);
            setRole1(councilDetails.role1);
            setRole2(councilDetails.role2);
            setTime(councilDetails.time);
            setAddress(councilDetails.address);
            console.log("Details: ", response.data);
        } catch (error) {
            if (error.response) {
                
                console.error('Error fetching council details:', error.response.status);
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
                console.error('No response received:', error.request);
                console.log('No response from the server. Please check your network.');
            } else {
                console.error('Error setting up the request:', error.message);
                console.log('An error occurred. Please try again.');
            }
        }
    };


    function convertDateTime(dateTimeString) {
        const parts = dateTimeString.split('T');
        const datePart = parts[0];
        const timePart = parts[1];
        const timeParts = timePart.split(':');
        const hour = timeParts[0];
        const minute = timeParts[1];
        const formattedDateTime = `${datePart} ${hour}:${minute}:00`;
        return formattedDateTime;
    }

    const handleFormSubmit = async () => {
        try {
            const response = await axiosInstance.post(`/head/council/edit/${subjectId}`, {
                time: convertDateTime(time),
                address,
                lecturer1,
                lecturer2,
                role1,
                role2,
            }, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleLecturerChange = (e, setLecturer) => {
        setLecturer(e.target.value);
    };

    const handleRoleChange = (e, setRole) => {
        setRole(e.target.value);
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
                                            setSubjectId(item.subjectId);
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
                                <label htmlFor="time" className="form-label">Thời gian</label>
                                <input type="datetime-local" className="form-control" id="time" value={time} onChange={(e) => setTime(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Địa chỉ</label>
                                <input type="text" className="form-control" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
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
                                            <td>{defaultLecturerId}</td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    onChange={(e) => handleRoleChange(e, setRole1)}
                                                    value={role1}
                                                >
                                                    <option value="">Chọn vai trò</option>
                                                    <option value="Chủ tịch">Chủ tịch</option>
                                                    <option value="Ủy viên">Ủy viên</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Thành viên 2</td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    onChange={(e) => handleLecturerChange(e, setLecturer2)}
                                                    value={lecturer2}
                                                >
                                                    <option value="">Chọn giảng viên</option>
                                                    {lecturerList.map((lecturer) => (
                                                        <option key={lecturer.lecturerId} value={lecturer.lecturerId}>
                                                            {lecturer.person.firstName + ' ' + lecturer.person.lastName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    onChange={(e) => handleRoleChange(e, setRole2)}
                                                    value={role2}
                                                >
                                                    <option value="">Chọn vai trò</option>
                                                    <option value="Chủ tịch">Chủ tịch</option>
                                                    <option value="Ủy viên">Ủy viên</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleFormSubmit}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataTableTopicSuccess;

