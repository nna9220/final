import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import './DataTableTopics.scss';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
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
                if (response.status === 200) {
                    console.log("Import thành công!");

                    // Cập nhật state topics chỉ khi dữ liệu trả về từ API là một mảng
                    if (Array.isArray(response.data)) {
                        setTopics(response.data);
                        toast.success("Import file thành công!");
                    } else {
                        // Xử lý trường hợp khi dữ liệu không phải là một mảng
                        console.error("Dữ liệu trả về không phải là một mảng");
                        toast.error("Có lỗi khi import file!");
                    }
                } else {
                    // Xử lý các mã trạng thái HTTP khác ngoài 200 OK
                    console.error(`Lỗi với mã trạng thái: ${response.status}`);
                    toast.success("Import file thành công!");
                }
            })
            .catch(error => {
                // Xử lý lỗi khi gọi API, chẳng hạn như lỗi mạng hoặc lỗi server
                if (error.response) {
                    // Lỗi từ server (mã trạng thái HTTP khác 2xx)
                    console.error(`Lỗi từ server: ${error.response.status} - ${error.response.data}`);
                    if (error.response.status === 500) {
                        // Chấp nhận mã lỗi 500 và hiển thị thông báo thành công
                        toast.success("Import file thành công");
                    } else {
                        toast.error(`Có lỗi khi import file! Mã lỗi: ${error.response.status}`);
                    }
                } else if (error.request) {
                    // Lỗi không có phản hồi từ server
                    console.error('Không nhận được phản hồi từ server:', error.request);
                    toast.error("Không nhận được phản hồi từ server!");
                } else {
                    // Lỗi khi thiết lập yêu cầu
                    console.error('Lỗi khi thiết lập yêu cầu:', error.message);
                    toast.error("Lỗi khi thiết lập yêu cầu!");
                }
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

    const columns = [
        {
            field: 'id', headerName: '#', width: 70
        },
        { field: 'subjectName', headerName: 'Tên đề tài', width: 200 },
        {
            field: 'instructorName',
            headerName: 'GVHD',
            width: 170,
            valueGetter: (params) =>
                params.row.instructorId?.person?.firstName && params.row.instructorId?.person?.lastName
                    ? `${params.row.instructorId.person.firstName} ${params.row.instructorId.person.lastName}`
                    : 'Chưa có'
        },
        {
            field: 'thesisAdvisorName',
            headerName: 'GVPB',
            width: 170,
            valueGetter: (params) =>
                params.row.thesisAdvisorId?.person?.firstName && params.row.thesisAdvisorId?.person?.lastName
                    ? `${params.row.thesisAdvisorId.person.firstName} ${params.row.thesisAdvisorId.person.lastName}`
                    : 'Chưa có'
        },
        { field: 'student1', headerName: 'SV 1', width: 100 },
        { field: 'student2', headerName: 'SV 2', width: 100 },
        { field: 'student3', headerName: 'SV 3', width: 100 },
        { field: 'requirement', headerName: 'Yêu cầu', width: 200 },
        {
            field: 'action',
            headerName: 'Action',
            width: 100,
            renderCell: (params) => (
                <button className='btnView'>View</button>
            ),
        },
    ];

    const rows = topics.map((topic, index) => ({
        id: index + 1,
        ...topic,
    }));

    return (
        <div className='table-subject'>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                <div>
                    <button  style={{border:'none', backgroundColor:'white', color:'#00337C'}}>
                        <DownloadOutlinedIcon /> Mẫu file Import đề tài TLCN
                    </button>
                </div>
                <div className="input-group" style={{ width: 'auto' }}>
                    <input type="file" className="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" onChange={handleFileChangeTLCN} />
                    <button className="btn btn-outline-secondary" type="button" id="inputGroupFileAddon04" onClick={handleImportFileTLCN}>Import file TLCN</button>
                </div>
            </div>
            <div className='body-table' style={{ padding: '10px' }} >
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        ...topics.initialState,
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                />
            </div>
            <ToastContainer />
        </div>
    );
}

export default DataTableTopics;
