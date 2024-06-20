import React, { useState, useEffect } from 'react';
import './DataClass.scss';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';
import { toast, ToastContainer } from 'react-toastify';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

function DataClass() {
    const [classes, setClasses] = useState([]);
    const [newClass, setNewClass] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [modalType, setModalType] = useState('');
    const [idClass, setIdClass] = useState(null);
    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        if (tokenSt) {
            axiosInstance.get('/admin/studentClass', {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
                .then(response => {
                    const classArray = response.data.listClass || [];
                    console.log("Classes: ", response.data.listClass);
                    setClasses(classArray);
                })
                .catch(error => {
                    console.error("error: ", error);
                });
        } else {
            console.log("Lỗi !!");
        }
    };

    const handleAddClass = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();

        axiosInstance.post('/admin/studentClass/create', null, {
            params: {
                className: newClass,
            },
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                setClasses([...classes, response.data]);
                setNewClass('');
                setShowForm(false);
                toast.success('Thêm lớp thành công!');
            })
            .catch(error => {
                console.error(error);
                if (error.response && error.response.status === 409) {
                    toast.error('Lớp đã tồn tại!');
                } else {
                    toast.error('Thêm lớp thất bại!');
                }
            });
    };

    const handleEditClass = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();

        axiosInstance.post(`/admin/studentClass/edit/${selectedClass.id}`, null, {
            params: {
                classId: selectedClass.id,
                classname: newClass,
            },
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                const updatedClass = classes.map(item => {
                    if (item.id === selectedClass.id) {
                        return { ...item, classname: newClass };
                    }
                    return item;
                });
                setClasses(updatedClass);
                setNewClass('');
                setShowForm(false);
                toast.success('Chỉnh sửa lớp thành công!');
            })
            .catch(error => {
                console.error(error);
                toast.error("Chỉnh sửa thông tin lớp thất bại");
            });
    };

    const handleViewClass = (classname) => {
        setSelectedClass(classname);
        setNewClass(classname.classname);
        setModalType('edit');
        setShowForm(true);
    };

    const handleDeleteClass = (idClass) => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log("idClass", idClass)
        axiosInstance.post(`/admin/studentClass/deleted/${idClass}`, null, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                toast.success('Xóa lớp thành công!');
            })
            .catch(error => {
                console.error(error);
                toast.error('Xóa lớp thất bại!');
            });
    };

    const columns = [
        { field: 'stt', headerName: 'STT', width: 100 },
        { field: 'classname', headerName: 'Tên lớp học', width: 200 },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editClass" onClick={() =>  {handleViewClass(params.row);setModalType('edit');}}>
                        <EditOutlinedIcon />
                    </button>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteClass" onClick={() => { setIdClass(params.row.id); setSelectedClass(params.row) }}>
                        <DeleteOutlineOutlinedIcon />
                    </button>
                </>
            ),
        },
    ];

    const rows = classes.map((item, index) => ({
        id: item.id, // Ensure this id is unique
        stt: index + 1,
        classname: item.classname,
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalType === 'add') {
            handleAddClass();
        } else if (modalType === 'edit') {
            handleEditClass();
        }
    };

    return (
        <div className="table-classes">
            <ToastContainer />
            <div className="content-table">
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addClass" onClick={() => {
                    setSelectedClass(null);
                    setNewClass('');
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
                            ...classes.initialState,
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                    />
                </div>
            </div>

            <div className="modal fade" id="addClass" tabIndex="-1" aria-labelledby="addClassLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <form className="modal-content" onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addClassLabel">Thêm Lớp học</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-floating mb-3 mt-3">
                                <input required
                                    type="text"
                                    className="form-control"
                                    id="className"
                                    placeholder="Nhập tên lớp"
                                    value={newClass}
                                    onChange={(e) => setNewClass(e.target.value)}
                                />
                                <label htmlFor="className">Tên Lớp</label>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="submit" className="btn btn-primary">Lưu</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="modal fade" id="editClass" tabIndex="-1" aria-labelledby="editClassLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="editClassLabel">Chỉnh sửa lớp</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-floating mb-3 mt-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="className"
                                        placeholder="Nhập tên lớp"
                                        value={newClass}
                                        onChange={(e) => setNewClass(e.target.value)}
                                    />
                                    <label htmlFor="className">Tên Lớp</label>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                    <button type="submit" className="btn btn-primary">Lưu</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="deleteClass" tabIndex="-1" aria-labelledby="deleteClassLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="deleteClassLabel">Xác nhận xóa</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Bạn chắc chắn muốn xóa lớp {selectedClass?.classname} không?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-primary" onClick={() => handleDeleteClass(idClass)}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataClass;
