import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { DataGrid } from '@mui/x-data-grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import axiosInstance from '../API/axios';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './Home.scss';
import Chatbot from './ChatBot/Chatbot';

const columns = [
    { field: 'id', headerName: '#', width: 70 },
    { field: 'subjectName', headerName: 'Tên đề tài', width: 200 },
    { field: 'instructor', headerName: 'GVHD', width: 200 },
    { field: 'major', headerName: 'Chuyên ngành', width: 150 },
    { field: 'student1', headerName: 'Sinh viên 1', width: 150 },
    { field: 'student2', headerName: 'Sinh viên 2', width: 150 },
    { field: 'student3', headerName: 'Sinh viên 3', width: 150 },
    { field: 'year', headerName: 'Niên khóa', width: 100 },
];

function Home() {
    const [informationTopics, setInformationTopics] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [tableType, setTableType] = useState('');
    const [showPDF, setShowPDF] = useState(false);
    const [selectedMajor, setSelectedMajor] = useState('Tất cả');

    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
        if (showTable) {
            const endpoint = tableType === 'tlcn' ? "/public/essay/tlcn" : "/public/essay/kltn";
            axiosInstance.get(endpoint)
                .then(response => {
                    console.log("API response:", response.data);
                    setInformationTopics(response.data.filter((item) => item.active === 9).map((item, index) => ({
                        id: index + 1,
                        subjectName: item.subjectName,
                        instructor: `${item.instructorId.person.firstName} ${item.instructorId.person.lastName}`,
                        major: item.major,
                        student1: item.student1,
                        student2: item.student2,
                        student3: item.student3,
                        year: item.year
                    })));
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [showTable, tableType]);

    const majorMapping = {
        'Công nghệ phần mềm': 'CongNghePhanMem',
        'An toàn thông tin': 'AnToanThongTin',
        'Hệ thống thông tin': 'HeThongThongTin',
        'Kỹ thuật dữ liệu': 'KyThuatDuLieu',
        'CLC': 'CLC',
        'Quốc tế': 'QuocTe'
    };

    const majorOptions = ['Tất cả', 'Công nghệ phần mềm', 'An toàn thông tin', 'Hệ thống thông tin', 'Kỹ thuật dữ liệu', 'CLC', 'Quốc tế'];

    const filteredTopics = selectedMajor === 'Tất cả'
        ? informationTopics
        : informationTopics.filter(topic => topic.major === majorMapping[selectedMajor]);

    return (
        <div className="hero">
            <Helmet>
                <title>Trang Chủ</title>
            </Helmet>
            <div className="card text-bg-white">
                <img src="/assets/Home_logo.jpg" className="card-img" alt="..." style={{ width: '100%', height: '50%' }} />
                <hr />
                <button>
                    <Chatbot/>
                </button>
                <div>
                    {!showTable && !showPDF ? (
                        <div className='container text-center'>
                            <div className="row">
                                <div className="col-lg-4">
                                    <img className="rounded-circle" src="/assets/TieuLuan.png" alt="Generic placeholder image" width="140" height="140" />
                                    <h2>Tiểu luận chuyên ngành</h2>
                                    <p><button className="btn btn-secondary" onClick={() => { setTableType('tlcn'); setShowTable(true); }}>Tham khảo &raquo;</button></p>
                                </div>
                                <div className="col-lg-4">
                                    <img className="rounded-circle" src="/assets/KhoaLuan.png" alt="Generic placeholder image" width="140" height="140" />
                                    <h2>Khóa luận tốt nghiệp</h2>
                                    <p><button className="btn btn-secondary" onClick={() => { setTableType('kltn'); setShowTable(true); }}>Tham khảo &raquo;</button></p>
                                </div>
                                <div className="col-lg-4">
                                    <img className="rounded-circle" src="/assets/HuongDan.jfif" alt="Generic placeholder image" width="140" height="140" />
                                    <h2>Hướng dẫn</h2>
                                    <p><button className="btn btn-secondary" onClick={() => setShowPDF(true)}>Xem &raquo;</button></p>
                                </div>
                            </div>
                        </div>
                    ) : showPDF ? (
                        <>
                            <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: '1.2vw' }}>
                                <button className="btn btn-secondary" style={{ border: 'none', backgroundColor: 'white', color: 'blue', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
                                    onClick={() => setShowPDF(false)}>
                                    <HomeOutlinedIcon style={{ marginRight: '8px' }} /> Trang chủ
                                </button>
                                <Typography color="textPrimary">
                                    Hướng dẫn
                                </Typography>
                            </Breadcrumbs>
                            <div className="pdf-viewer" style={{ width: '100%', height: '750px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
                                    <div style={{ width: '80%', height: '100%' }}>
                                        <Viewer
                                            fileUrl="/assets/HDSD_SauDaiHoc_HocVien.pdf"
                                            plugins={[defaultLayoutPluginInstance]}
                                        />
                                    </div>
                                </Worker>
                            </div>
                        </>
                    ) : (
                        <div className="content d-flex">
                            <div className="flex-1">
                                <Breadcrumbs aria-label="breadcrumb" style={{ fontSize: '1.2vw' }}>
                                    <button className="btn btn-secondary" style={{ border: 'none', backgroundColor: 'white', color: 'blue', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
                                        onClick={() => setShowTable(false)}>
                                        <HomeOutlinedIcon style={{ marginRight: '8px' }} /> Trang chủ
                                    </button>
                                    <Typography color="textPrimary">
                                        {tableType === 'tlcn' ? 'Tham khảo Tiểu luận chuyên ngành' : 'Tham khảo Khóa luận tốt nghiệp'}
                                    </Typography>
                                </Breadcrumbs>
                                <div className="d-flex">
                                    <div className="sidebar" style={{ width: '250px', marginTop: '20px', marginRight: '20px' }}>
                                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                                            {majorOptions.map(option => (
                                                <li key={option} style={{ marginBottom: '5px' }}>
                                                    <button
                                                        onClick={() => setSelectedMajor(option)}
                                                        style={{
                                                            backgroundColor: selectedMajor === option ? '#3282B8' : 'white',
                                                            border: 'none',
                                                            padding: '10px',
                                                            width: '100%',
                                                            textAlign: 'left',
                                                            cursor: 'pointer',
                                                            color: selectedMajor === option ? 'white' : 'black',
                                                            fontWeight: selectedMajor === option ? 'bold' : 'normal'
                                                        }}
                                                    >
                                                        {option}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {filteredTopics.length > 0 ? (
                                        <div style={{ height: 600, width: '73%', marginTop: '20px' }}>
                                            <DataGrid
                                                rows={filteredTopics}
                                                columns={columns}
                                                initialState={{
                                                    pagination: { paginationModel: { pageSize: 10 } },
                                                }}
                                                pageSizeOptions={[10, 25, 50]}
                                                sx={{
                                                    boxShadow: 2,
                                                    border: 2,
                                                    borderColor: 'primary.light',
                                                    '& .MuiDataGrid-cell:hover': {
                                                        color: 'primary.main',
                                                    },
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <Typography variant="h6" style={{ marginTop: '20px' }}>
                                            Không có dữ liệu phù hợp.
                                        </Typography>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
