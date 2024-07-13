import React, { useState, useEffect } from 'react';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Button from '@mui/material/Button';
import './DataYears.scss';

function DataYears() {
    const [years, setYears] = useState([]);
    const [newYear, setNewYear] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);
    const [modalType, setModalType] = useState('');
    const [idYear, setIdYear] = useState(null);

    useEffect(() => {
        fetchYears();
    }, []);

    const fetchYears = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        if (userToken) {
            axiosInstance.get('/admin/schoolYear', {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            })
            .then(response => {
                const yearsList = response.data.listYear || [];
                setYears(yearsList.reverse());
            })
            .catch(error => {
                console.error(error);
            });
        }
    };

    // Hàm kiểm tra định dạng năm
    const isValidYearFormat = (year) => {
        const regex = /^\d{4}-\d{4}$/;
        return regex.test(year);
    };

    const handleAddYear = () => {
        if (!isValidYearFormat(newYear)) {
            toast.error('Định dạng niên khóa không hợp lệ! (Ví dụ: 2016 - 2020)');
            return;
        }
        if (!newYear.trim()) {
            toast.error('Tên niên khóa không được để trống!');
            return;
        }

        const userToken = getTokenFromUrlAndSaveToStorage();
        axiosInstance.post('/admin/schoolYear/create', null, {
            params: { year: newYear },
            headers: { 'Authorization': `Bearer ${userToken}` },
        })
        .then(response => {
            setYears([response.data, ...years]);
            setNewYear('');
            setShowForm(false);
            toast.success('Thêm niên khóa thành công!');
            document.getElementById('addYear').classList.remove('show');
            document.body.classList.remove('modal-open');
            document.querySelector('.modal-backdrop').remove();
        })
        .catch(error => {
            console.error(error);
            toast.error('Thêm niên khóa thất bại!');
        });
    };

    const handleEditYear = () => {
        if (!isValidYearFormat(newYear)) {
            toast.error('Định dạng niên khóa không hợp lệ! (Ví dụ: 2016-2020)');
            return;
        }
        if (!newYear.trim()) {
            toast.error('Tên niên khóa không được để trống!');
            return;
        }
        const userToken = getTokenFromUrlAndSaveToStorage();
        axiosInstance.post(`/admin/schoolYear/edit/${idYear}`, null, {
            params: {
                yearId: selectedYear.yearId,
                year: newYear
            },
            headers: { 'Authorization': `Bearer ${userToken}` },
        })        
        .then(response => {
            const updatedYears = years.map(item => {
                if (item.yearId === selectedYear.yearId) {
                    return { ...item, year: newYear };
                }
                return item;
            });
            setYears(updatedYears);
            setNewYear('');
            setShowForm(false);
            toast.success('Chỉnh sửa niên khóa thành công!');
            document.getElementById('editYear').classList.remove('show');
            document.body.classList.remove('modal-open');
            document.querySelector('.modal-backdrop').remove();
            fetchYears();
        })
        .catch(error => {
            console.error(error);
            toast.error('Chỉnh sửa niên khóa thất bại!');
        });
    };

    const handleViewYear = (year) => {
        setSelectedYear(year);
        setNewYear(year.year);
        setModalType('edit');
        setShowForm(true);
    };

    const handleDeleteYear = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log("id:", idYear);
        axiosInstance.post(`/admin/schoolYear/deleted/${idYear}`, null, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
        .then(response => {
            setYears(years.filter(item => item.yearId !== idYear));
            toast.success('Xóa niên khóa thành công!');
            document.getElementById('deleteYear').classList.remove('show');
            document.body.classList.remove('modal-open');
            document.querySelector('.modal-backdrop').remove();
        })
        .catch(error => {
            console.error(error);
            toast.error('Xóa niên khóa thất bại!');
        });
    };

    const columns = [
        { field: 'stt', headerName: 'STT', width: 100 },
        { field: 'year', headerName: 'Tên niên khóa', width: 200 },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <>
                    <button type="button" style={{marginRight:'10px', color:'#1572A1', fontWeight:'bolder'}} className="btn" data-bs-toggle="modal" data-bs-target="#editYear" onClick={() =>{setIdYear(params.row.id);handleViewYear(params.row)}}>
                        <EditOutlinedIcon />
                    </button>
                    <button type="button" style={{marginRight:'10px', color:'#FF7878', fontWeight:'bolder'}} className="btn" data-bs-toggle="modal" data-bs-target="#deleteYear" onClick={() => { setIdYear(params.row.id); setSelectedYear(params.row) }}>
                        <DeleteOutlineOutlinedIcon />
                    </button>
                </>
            ),
        },
    ];

    const rows = years.map((item, index) => ({
        id: item.yearId, 
        stt: index + 1,
        year: item.year,
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalType === 'add') {
            handleAddYear();
        } else if (modalType === 'edit') {
            handleEditYear();
        }
    };

    return (
        <div className='table-years'>
            <ToastContainer />
            <div className='content-table'>
                <button type="button" style={{marginBottom:'10px'}} className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addYear" onClick={() => {
                    setSelectedYear(null);
                    setNewYear('');
                    setModalType('add');
                    setShowForm(true);
                }}>
                    <AddCircleOutlineOutlinedIcon />
                </button>
                <div>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                    />
                </div>
            </div>

            <div className="modal fade" id="addYear" tabIndex="-1" aria-labelledby="addYearLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <form className="modal-content" onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addYearLabel">Thêm Niên Khóa</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-floating mb-3 mt-3">
                                <input required
                                    type="text"
                                    className="form-control"
                                    id="yearName"
                                    placeholder="Nhập tên niên khóa"
                                    value={newYear}
                                    onChange={(e) => setNewYear(e.target.value)}
                                />
                                <label htmlFor="yearName">Tên Niên Khóa</label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="submit" className="btn btn-primary">Lưu</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="modal fade" id="editYear" tabIndex="-1" aria-labelledby="editYearLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <form className="modal-content" onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editYearLabel">Chỉnh Sửa Niên Khóa</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-floating mb-3 mt-3">
                                <input required
                                    type="text"
                                    className="form-control"
                                    id="yearName"
                                    placeholder="Nhập tên niên khóa"
                                    value={newYear}
                                    onChange={(e) => setNewYear(e.target.value)}
                                />
                                <label htmlFor="yearName">Tên Niên Khóa</label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="submit" className="btn btn-primary">Lưu</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="modal fade" id="deleteYear" tabIndex="-1" aria-labelledby="deleteYearLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="deleteYearLabel">Xóa Niên Khóa</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc chắn muốn xóa niên khóa <strong>{selectedYear ? selectedYear.year : ''}</strong>?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" className="btn btn-primary" onClick={handleDeleteYear}>Xóa</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataYears;
