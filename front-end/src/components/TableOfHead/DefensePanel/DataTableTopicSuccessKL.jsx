import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DataTableTopicSuccessKL() {
    const [subjects, setSubjects] = useState([]);
    const [error, setError] = useState(null);
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [council, setCouncil] = useState();
    const [councilLecturers, setCouncilLecturers] = useState([]);
    const [listLecturer, setListLecturer] = useState([]);
    const [councilEdit, setCouncilEdit] = useState({
        lecturer1: '',
        lecturer2: '',
        lecturer3: '',
        start: '',
        end: '',
        date: '',
        address: '',
    });
    const [lecturers, setLecturers] = useState([]);
    const [autoCouncil, setAutoCouncil] = useState({
        date: '',
        address: ''
    })

    const handleChangeAuto = (e) => {
        const { name, value } = e.target;
        setAutoCouncil({
            ...autoCouncil,
            [name]: value
        });
    };
    useEffect(() => {
        if (userToken) {
            loadData();
        }
    }, [userToken]);

    const loadData = async () => {
        try {
            const response = await axiosInstance.get('/head/manager/council/listSubject', {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            console.log(response.data);

            if (response.data.statusCodeValue === 400 && response.data.body === "Không nằm trong khoảng thời gian hội đồng được tổ chức.") {
                setError("Không nằm trong thời gian lập hội đồng");
            } else {
                setSubjects(Array.isArray(response.data.body) ? response.data.body : []);
                setError(null); // Clear any previous error
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setError('Đã xảy ra lỗi khi tải dữ liệu');
        }
    };

    const loadCouncilDetails = async (subjectId) => {
        try {
            const response = await axiosInstance.get(`/head/manager/council/detailCouncil/${subjectId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            const councilDetails = response.data.body.council;
            setCouncil(councilDetails);
            setCouncilLecturers(response.data.body.councilLecturer);
            console.log("Data lecturer: ", response.data.body.councilLecturer)
            setLecturers(response.data.body.listLecturer);
            console.log("List Lecturer: ", response.data.body.listLecturer);
            setCouncilEdit({
                lecturer1: councilDetails.lecturer1?.personId || '',
                lecturer2: councilDetails.lecturer2?.personId || '',
                lecturer3: councilDetails.lecturer3?.personId || '',
                lecturer4: councilDetails.lecturer4?.personId || '',
                lecturer5: councilDetails.lecturer5?.personId || '',
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

    const loadListLecturer = async (subjectId) => {
        try {
            const response = await axiosInstance.get(`/head/manager/council/listLecturer/${subjectId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });
            setListLecturer(response.data.listLecturer);
            console.log("List lecturer ", response.data)
        } catch (error) {
            console.log("erorr list lecturer: ", error);
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

        const formData = new FormData();
        formData.append('lecturer1', formattedCouncilEdit.lecturer1);
        formData.append('lecturer2', formattedCouncilEdit.lecturer2);
        formData.append('lecturer3', formattedCouncilEdit.lecturer3);
        formData.append('timeStart', formattedCouncilEdit.start);
        formData.append('timeEnd', formattedCouncilEdit.end);
        formData.append('date', formattedCouncilEdit.date);
        formData.append('address', formattedCouncilEdit.address);

        try {
            const response = await axiosInstance.post(
                `/head/manager/council/editCouncil/${council.subject.subjectId}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            console.log("Save response: ", response.data);
            toast.success('Lập hội đồng thành công!');
        } catch (error) {
            console.error('Error saving council details:', error.response ? error.response.data : error.message);
            toast.error('Lập hội đồng thất bại. Vui lòng thử lại.');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const { address, date } = autoCouncil;

        if (!address || !date) {
            toast.error('Vui lòng nhập đầy đủ địa chỉ và ngày');
            return;
        }

        try {
            const response = await axiosInstance.post('/head/manager/council/autoCouncil', null, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: {
                    address,
                    date,
                },
            });

            if (response.status === 200) {
                toast.success('Tạo hội đồng tự động thành công!');
                console.log('Response:', response.data);
            }
        } catch (error) {
            console.error('Error creating automatic council:', error);
            toast.error('Lỗi khi tạo hội đồng tự động. Vui lòng thử lại.');
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
                    <div>
                        <button type="button" style={{ padding: '8px', border: 'none', backgroundColor: '#3282B8', color: "white", borderRadius: '5px' }} class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#automationCouncil">
                            Lập hội đồng tự động
                        </button>
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
                                    Array.isArray(subjects) && subjects.filter((item) => item.active === 8).map((item, index) => (
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
                                                    loadCouncilDetails(item.subjectId); loadListLecturer(item.subjectId)
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
                )}
            </div>

            <div class="modal fade" id="automationCouncil" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <form class="modal-content" onSubmit={handleSubmit}>
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Lập hội đồng tự động</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Địa chỉ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    name="address"
                                    value={autoCouncil.address}
                                    onChange={handleChangeAuto}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="date" className="form-label">Ngày</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    name="date"
                                    value={autoCouncil.date}
                                    onChange={handleChangeAuto}
                                />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Xác nhận</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
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

                            <br />

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Vai trò</th>
                                        <th>Thành viên</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {councilLecturers.map((data, index) => (
                                        <tr key={index}>
                                            <td>{data.role}</td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    name={`lecturer${index + 1}`}
                                                    value={councilEdit[`lecturer${index + 1}`] || ''}
                                                    onChange={handleChange}
                                                >
                                                    <option>{data.lecturer.person.firstName + ' ' + data.lecturer.person.lastName}</option>
                                                    {lecturers.map(l => (
                                                        <option key={l.lecturerId} value={l.lecturerId}>
                                                            {l.person.firstName + ' ' + l.person.lastName}
                                                        </option>
                                                    ))}
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

export default DataTableTopicSuccessKL;