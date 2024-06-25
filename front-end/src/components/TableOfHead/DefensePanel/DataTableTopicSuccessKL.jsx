import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import { useState, useEffect } from 'react';

function DataTableTopicSuccessKL() {
    const [subjects, setSubjects] = useState([]);
    const [time, setTime] = useState('');
    const [address, setAddress] = useState('');
    const [lecturer1, setLecturer1] = useState('');
    const [lecturer2, setLecturer2] = useState('');
    const [lecturer3, setLecturer3] = useState('');
    const [lecturer4, setLecturer4] = useState('');
    const [lecturers, setLecturers] = useState([]);
    const [subjectId, setSubjectId] = useState(null);
    const [council, setCouncil] = useState([]);
    const [defaultLecturerId, setDefaultLecturerId] = useState('');
    const [lecturerList, setLecturerList] = useState([]);
    const userToken = getTokenFromUrlAndSaveToStorage();

    useEffect(() => {
        if (userToken) {
            loadData();
            console.log("ID sau f5: ", defaultLecturerId);
            if (defaultLecturerId !== undefined) {
                // Thiết lập giá trị mặc định cho Thành viên 1 nếu chưa có giá trị được chọn
                const updatedLecturers = lecturers.map((lecturer, index) => index === 0 && !lecturer ? defaultLecturerId : lecturer);
                // Cập nhật giá trị cho state lecturers
                setLecturers(updatedLecturers);
            }
        }
    }, [userToken, defaultLecturerId]);

    const loadData = async () => {
        try {
            const response = await axiosInstance.get('/head/manager/council/listSubject', {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            console.log("Topic: ", response.data.body);
            setSubjects(response.data.body);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };


    // Hàm chuyển đổi từ xâu kí tự sang đối tượng Date
    function convertStringToDate(dateTimeString) {
        const [datePart, timePart] = dateTimeString.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hour, minute, second] = timePart.split(':');
        // Chú ý rằng month - 1 vì tháng trong JavaScript bắt đầu từ 0
        return new Date(year, month - 1, day, hour, minute, second);
    }

    function convertDateTime(dateTimeString) {
        // Phân tích chuỗi thành các phần riêng biệt
        const parts = dateTimeString.split('T');
        const datePart = parts[0]; // Ngày/tháng/năm
        const timePart = parts[1]; // Giờ/phút

        // Phân tích phần thời gian thành giờ và phút
        const timeParts = timePart.split(':');
        const hour = timeParts[0]; // Giờ
        const minute = timeParts[1]; // Phút

        // Định dạng lại chuỗi thành "yyyy-MM-dd HH:mm:ss"
        const formattedDateTime = `${datePart} ${hour}:${minute}:00`;

        return formattedDateTime;
    }

    const handleFormSubmit = async () => {
        try {
            console.log("dt: ", lecturer1+lecturer2+lecturer3+lecturer4);
            const response = await axiosInstance.post(`/head/manager/council/edit/${subjectId}`, {
                time:convertDateTime(time),
                address,
                lecturer1,
                lecturer2,
                lecturer3,
                lecturer4,
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
    
    
    const loadLecturers = async (subjectId) => {
        try {
            const response = await axiosInstance.get(`/head/manager/council/listLecturer/${subjectId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            setLecturerList(response.data.listLecturer);
        } catch (error) {
            console.error('Error fetching lecturers:', error);
        }
    };

    const loadCouncil = async (subjectId) => {
        try {
            const response = await axiosInstance.get(`/head/manager/council/detailCouncil/${subjectId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            console.log("Council", response.data);
            setCouncil(response.data.listLecturerOfCouncil);
            // Thiết lập giá trị mặc định cho Thành viên 1
            if (response.data.listLecturerOfCouncil.length > 0) {
                setDefaultLecturerId(response.data.listLecturerOfCouncil[0].person.firstName + ' ' + response.data.listLecturerOfCouncil[0].person.lastName);
                console.log("ID: ", defaultLecturerId);
                console.log(response.data.listLecturerOfCouncil[0].person.personId)
            }
        } catch (error) {
            console.error('Error fetching lecturers:', error);
        }
    };


    const handleLecturerChange = (e, setLecturer) => {
        setLecturer(e.target.value);
    };
    const getDefaultLecturerId = (index) => {
        if (lecturerList.length > index) {
            return lecturerList[index].id;
        }
        return '';
    };

    return (
        <div>
            <div  style = {{padding:'16px'}} className='body-table-topic'>
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
                            <th scope='col'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{subject.subjectName}</td>
                                <td>{`${subject.instructorId.person.firstName} ${subject.instructorId.person.lastName}`}</td>
                                <td>{subject.thesisAdvisorId?.person ? `${subject.thesisAdvisorId.person.firstName} ${subject.thesisAdvisorId.person.lastName}` : 'Chưa có'}</td>
                                <td>{subject.student1}</td>
                                <td>{subject.student2}</td>
                                <td>{subject.student3}</td>
                                <td>
                                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => {
                                        setSubjectId(subject.subjectId);
                                        loadLecturers(subject.subjectId);
                                        loadCouncil(subject.subjectId);
                                    }}>
                                        Lập hội đồng
                                    </button>
                                </td>
                            </tr>
                        ))}
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Thành viên 1</td>
                                            <td>
                                                {defaultLecturerId}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Thành viên 2</td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    onChange={(e) => handleLecturerChange(e, setLecturer1)}
                                                    value={lecturer1}
                                                >
                                                    <option value="">Chọn giảng viên</option>
                                                    {lecturerList.map((lecturer) => (
                                                        <option key={lecturer.lecturerId} value={lecturer.lecturerId}>
                                                            {lecturer.person.firstName + ' ' + lecturer.person.lastName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Thành viên 3</td>
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
                                        </tr>
                                        <tr>
                                            <td>Thành viên 4</td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    onChange={(e) => handleLecturerChange(e, setLecturer3)}
                                                    value={lecturer3}
                                                >
                                                    <option value="">Chọn giảng viên</option>
                                                    {lecturerList.map((lecturer) => (
                                                        <option key={lecturer.lecturerId} value={lecturer.lecturerId}>
                                                            {lecturer.person.firstName + ' ' + lecturer.person.lastName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Thành viên 5</td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    onChange={(e) => handleLecturerChange(e, setLecturer4)}
                                                    value={lecturer4}
                                                >
                                                    <option value="">Chọn giảng viên</option>
                                                    {lecturerList.map((lecturer) => (
                                                        <option key={lecturer.lecturerId} value={lecturer.lecturerId}>
                                                            {lecturer.person.firstName + ' ' + lecturer.person.lastName}
                                                        </option>
                                                    ))}
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

export default DataTableTopicSuccessKL;

