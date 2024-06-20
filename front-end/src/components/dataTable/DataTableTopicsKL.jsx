import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import './DataTableTopics.scss';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import axiosInstance from '../../API/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DataTableTopicsKL() {
    const [topics, setTopics] = useState([]);
    const [file, setFile] = useState(null);
    const [activeTLChuyenNganh, setActiveTLChuyenNganh] = useState(false);
    const [activeKhoaLuan, setActiveKhoaLuan] = useState(false);
    const [showAddToast, setShowAddToast] = useState(false);
    const [showErrorToastAdd, setShowErrorToastAdd] = useState(false);
    const [lecturers, setLecturers] = useState([]);
    const [lecturerIds, setLecturerIds] = useState([]);

    useEffect(() => {
        handleListKLTN();
    }, []);

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
            })
            .catch(error => {
                console.error("error: ", error);
            });
    };

    const handleFileChangeKLTN = (event) => {
        const file = event.target.files[0];
        setFile(file); // Lưu file vào state
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
                    toast.success("import file thành công!")
                } else {
                    // Xử lý trường hợp khi dữ liệu không phải là mảng
                    console.error("Dữ liệu trả về không phải là một mảng");
                    toast.error("Có lỗi khi import file!")
                }
            })
            .catch(error => {
                console.error(error);
                console.log("Lỗi");
            });
    };

    const columns = [
        { field: 'id', headerName: '#', width: 90 },
        { field: 'subjectName', headerName: 'Tên đề tài', width: 200 },
        {
            field: 'instructorName',
            headerName: 'GVHD',
            width: 200,
            valueGetter: (params) =>
                params.row.instructorId?.person?.firstName && params.row.instructorId?.person?.lastName
                    ? `${params.row.instructorId.person.firstName} ${params.row.instructorId.person.lastName}`
                    : 'Chưa có'
        },
        {
            field: 'thesisAdvisorName',
            headerName: 'GVPB',
            width: 200,
            valueGetter: (params) =>
                params.row.thesisAdvisorId?.person?.firstName && params.row.thesisAdvisorId?.person?.lastName
                    ? `${params.row.thesisAdvisorId.person.firstName} ${params.row.thesisAdvisorId.person.lastName}`
                    : 'Chưa có'
        },
        { field: 'student1', headerName: 'SV 1', width: 130 },
        { field: 'student2', headerName: 'SV 2', width: 130 },
        { field: 'student3', headerName: 'SV 3', width: 130 },
        { field: 'requirement', headerName: 'Yêu cầu', width: 200 },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
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
                    <button style={{ border: 'none', backgroundColor: 'white', color: '#00337C' }}>
                        <DownloadOutlinedIcon /> Mẫu file Import đề tài KLTN
                    </button>
                </div>

                <div className="input-group" style={{ width: 'auto' }}>
                    <input type="file" className="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" onChange={handleFileChangeKLTN} />
                    <button className="btn btn-outline-secondary" type="button" id="inputGroupFileAddon04" onClick={handleImportFileKLTN}>Import file TLCN</button>
                </div>
            </div>
            <div className='body-table' style={{ padding: '10px' }}>
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

export default DataTableTopicsKL;
