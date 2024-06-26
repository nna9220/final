import React, { useState, useEffect } from 'react';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import './DataTableTopics.scss';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import { Toast } from 'react-bootstrap';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axiosInstance from '../../API/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DataTableTopics() {
    const [topics, setTopics] = useState([]);
    const [file, setFile] = useState(null);
    const [activeTLChuyenNganh, setActiveTLChuyenNganh] = useState(false);
    const [activeKhoaLuan, setActiveKhoaLuan] = useState(false);
    const [showAddToast, setShowAddToast] = useState(false);
    const [showErrorToastAdd, setShowErrorToastAdd] = useState(false);
    const [lecturers, setLecturers] = useState([]);
    const [lecturerIds, setLecturerIds] = useState([]);

    useEffect(() => {
        handleListTLCN();
    }, []);

    const handleListTLCN = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        axiosInstance.get('/admin/subject/tlcn', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("DataTableSubject: ", response.data);
                const topicArray = response.data || [];
                setTopics(topicArray);
                setActiveTLChuyenNganh(true);
                setActiveKhoaLuan(false);
            })
            .catch(error => {
                console.error("error: ", error);
            });
    };

    const handleListKLTN = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        axiosInstance.get('/admin/subject/kltn', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("DataTableSubject: ", response.data);
                const topicArray = response.data || [];
                setTopics(topicArray);
                setActiveKhoaLuan(true);
                setActiveTLChuyenNganh(false);
            })
            .catch(error => {
                console.error("error: ", error);
            });
    };

    const handleFileChangeTLCN = (event) => {
        const file = event.target.files[0];
        setFile(file); // Lưu file vào state
    };

    const handleFileChangeKLTN = (event) => {
        const file = event.target.files[0];
        setFile(file); // Lưu file vào state
    };

    const handleSelectChange = (event, index) => {
        const { value } = event.target;
        const newLecturerIds = [...lecturerIds];
        newLecturerIds[index] = value;
        setLecturerIds(newLecturerIds);
    };

    const handleImportFileTLCN = () => {
        const userToken = getTokenFromUrlAndSaveToStorage(); // Lấy userToken
        const formData = new FormData(); // Khởi tạo formData
        formData.append('file', file); // Thêm file vào formData

        axiosInstance.post('/admin/subject/importTLCN', formData, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                console.log("Import thành công!");
                // Cập nhật state topics chỉ khi dữ liệu trả về từ API là một mảng
                if (Array.isArray(response.data)) {
                    setTopics(response.data);
                    setShowAddToast(true);
                } else {
                    // Xử lý trường hợp khi dữ liệu không phải là mảng
                    console.error("Dữ liệu trả về không phải là một mảng");
                }
            })
            .catch(error => {
                console.error(error);
                console.log("Lỗi");
            });
    };

    const handleImportFileKLTN = () => {
        const userToken = getTokenFromUrlAndSaveToStorage(); // Lấy userToken
        const formData = new FormData(); // Khởi tạo formData
        formData.append('file', file); // Thêm file vào formData

        axiosInstance.post('/admin/subject/importKLTN', formData, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                console.log("Import KLTN thành công!");
                // Cập nhật state topics chỉ khi dữ liệu trả về từ API là một mảng
                if (Array.isArray(response.data)) {
                    setTopics(response.data);
                    setShowAddToast(true);
                } else {
                    // Xử lý trường hợp khi dữ liệu không phải là mảng
                    console.error("Dữ liệu trả về không phải là một mảng");
                }
            })
            .catch(error => {
                console.error(error);
                console.log("Lỗi");
            });
    };

    const handleAssignGVPB = (subjectId, index) => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        axiosInstance.get(`/admin/subject/listLecturer/${subjectId}`, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("List of lecturers for counter argument: ", response.data.listLecturer);
                setLecturers(response.data.listLecturer);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleGVPB = (subjectId, index) => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        const lecturerId = lecturerIds[index]; // Lấy lecturerId tương ứng với đề tài
        if (lecturerId && subjectId) {
            axiosInstance.post(`/admin/subject/addCounterArgumrnt/${subjectId}/${lecturerId}`, null, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            })
                .then(response => {
                    console.log('Successfully assigned lecturer for counter argument:', response.data);
                })
                .catch(error => {
                    console.error('Error assigning lecturer for counter argument:', error);
                });
        } else {
            console.error('LectureId or subjectId is undefined or empty');
            console.log("LectureId: ", lecturerId);
            console.log("SubjectId: ", subjectId);
        }
    };

    const handleGVHD = (subjectId, index) => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        const lecturerId = lecturerIds[index]; // Lấy lecturerId tương ứng với đề tài
        if (lecturerId && subjectId) {
            axiosInstance.post(`/admin/subject/addInstructor/${subjectId}/${lecturerId}`, null, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            })
                .then(response => {
                    console.log('Phân giảng viên hướng dẫn thành công:', response.data);
                })
                .catch(error => {
                    console.error('Thêm giảng viên HD thất bại:', error);
                });
        } else {
            console.error('LectureId or subjectId is undefined or empty');
            console.log("LectureId: ", lecturerId);
            console.log("SubjectId: ", subjectId);
        }
    };

    return (
        <div className='table-subject'>
            <div className='header-tableTopic'>
                <div className='button-add'>
                    <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#AddTopic">
                        Add
                    </button>

                    <div className="modal fade" id="AddTopic" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Thêm đề tài</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    ...
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='btn-type'>
                    <button className={`button-listDelete ${activeTLChuyenNganh ? 'active' : ''}`} onClick={handleListTLCN}>
                        <TopicOutlinedIcon /> Tiểu luận chuyên ngành
                    </button>
                    <button className={`button-listDelete ${activeKhoaLuan ? 'active' : ''}`} onClick={handleListKLTN}>
                        <SummarizeOutlinedIcon /> Khóa luận tốt nghiệp
                    </button>
                </div>
            </div>
            <div style={{display:'flex', justifyContent:'space-between',padding:'10px'}}>
                <div class="input-group" style={{padding:'10px'}}>
                    <input type="file" class="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" onChange={handleFileChangeTLCN} />
                    <button class="btn btn-outline-secondary" type="button" id="inputGroupFileAddon04" onClick={handleImportFileTLCN}>Import file TLCN</button>
                </div>
                <div class="input-group" style={{padding:'10px'}}>
                    <input type="file" class="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" onChange={handleFileChangeKLTN} />
                    <button class="btn btn-outline-secondary" type="button" id="inputGroupFileAddon04" onClick={handleImportFileKLTN}>Import file KLTN</button>
                </div>
            </div>
            <div className='body-table'>
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
                            <th scope='col'>Yêu cầu</th>
                            <th scope='col'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(topics) && topics.map((item, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.subjectName}</td>
                                <td>
                                    {item.instructorId?.person?.firstName && item.instructorId?.person?.lastName
                                        ? item.instructorId.person.firstName + ' ' + item.instructorId.person.lastName
                                        : 'Chưa có'}
                                </td>
                                <td>
                                    {item.thesisAdvisorId?.person?.firstName && item.thesisAdvisorId?.person?.lastName
                                        ? item.thesisAdvisorId.person.firstName + ' ' + item.thesisAdvisorId.person.lastName
                                        : 'Chưa có'}
                                </td>
                                {/*<td>
                                    {item.instructorId?.person?.firstName + ' ' + item.instructorId?.person?.lastName}
                                    <select className='optionLecs' value={lecturerIds[index]} onChange={(event) => handleSelectChange(event, index)} onClick={() => handleAssignGVPB(item.subjectId, index)}>
                                        <option className='option' value="" >Chọn giảng viên hướng dẫn</option>
                                        {lecturers.map((lecturer, idx) => (
                                            <option key={idx} value={lecturer.lecturerId}>{lecturer.person?.firstName} {lecturer.person?.lastName}</option>
                                        ))}
                                    </select>
                                    <button className='btn-assign' onClick={() => handleGVHD(item.subjectId, index)}>Phân công</button>
                                </td>
                                <td>
                                    {item.thesisAdvisorId?.person?.firstName + ' ' + item.thesisAdvisorId?.person?.lastName}
                                    <select className='optionLecs' value={lecturerIds[index]} onChange={(event) => handleSelectChange(event, index)} onClick={() => handleAssignGVPB(item.subjectId, index)}>
                                        <option className='option' value="" >Chọn giảng viên phản biện</option>
                                        {lecturers.map((lecturer, idx) => (
                                            <option key={idx} value={lecturer.lecturerId}>{lecturer.person?.firstName} {lecturer.person?.lastName}</option>
                                        ))}
                                    </select>
                                    <button className='btn-assign' onClick={() => handleGVPB(item.subjectId, index)}>Phân công</button>
                                </td>  */}
                                <td>{item.student1}</td>
                                <td>{item.student2}</td>
                                <td>{item.student3}</td>
                                <td>{item.requirement}</td>
                                <td>
                                    <button className='btnView'>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DataTableTopics;


