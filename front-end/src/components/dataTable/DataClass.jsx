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
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

function DataClass() {
    const [classes, setClasses] = useState([]);
    const [newClass, setNewClass] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null); // State lưu thông tin năm được chọn để chỉnh sửa

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
                    setClasses(classArray);
                })
                .catch(error => {
                    console.error("error: ", error);
                });
        } else {
            console.log("Lỗi !!")
        }
    };

    const handleAddClass = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();

        axiosInstance.post('/admin/studentClass/create', null, {
            params: {
                className: newClass
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
                classname: newClass
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
                toast.success('Chỉnh sửa lớp thành công!')
            })
            .catch(error => {
                console.error(error);
                toast.error("Chỉnh sửa thông tin lớp thất bại")
            });
    };

    const handleViewClass = (classname) => {
        setSelectedClass(classname);
        setNewClass(classname.classname);
        setShowForm(true);
    };

    const handleDeleteClass = () => {

    }

    const handleExport = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        axiosInstance.get('/admin/studentClass/export', {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${tokenSt}`,
            },
        })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'classes_report.xls');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => {
                console.error("Export error: ", error);
                toast.error('Xuất báo cáo thất bại!')
            });
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'classname', headerName: 'Tên lớp học', width: 200 },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewClass(params.row)}
                    >
                        <EditOutlinedIcon />
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#F05454', marginLeft: 1 }}
                        onClick={() => handleDeleteClass(params.row)}
                    >
                        <DeleteOutlineOutlinedIcon />
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div className='table-classes'>
            <ToastContainer />
            <div className='content-table'>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                        setSelectedClass(null);
                        setNewClass('');
                        setShowForm(true);
                    }}
                >
                    <AddCircleOutlineOutlinedIcon />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveAltIcon />}
                    onClick={handleExport}
                    style={{ marginLeft: '10px' }}
                >
                    Export
                </Button>
                {showForm && (
                    <Dialog open={showForm} onClose={() => setShowForm(false)}>
                        <DialogTitle>{selectedClass ? 'CHỈNH SỬA LỚP' : 'THÊM LỚP'}</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Tên lớp"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={newClass}
                                onChange={(e) => setNewClass(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setShowForm(false)}>Cancel</Button>
                            {selectedClass ? (
                                <Button onClick={handleEditClass}>Update</Button>
                            ) : (
                                <Button onClick={handleAddClass}>Add</Button>
                            )}
                        </DialogActions>
                    </Dialog>
                )}
                <div>
                    <DataGrid
                        rows={classes.map((item, index) => ({ ...item, id: index + 1 }))}
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
        </div>
    );
}
export default DataClass;
