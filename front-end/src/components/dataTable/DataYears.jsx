import React, { useState, useEffect } from 'react';
import axiosInstance from '../../API/axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import './DataYears.scss';

function DataYears() {
    const [years, setYears] = useState([]);
    const [newYear, setNewYear] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);

    useEffect(() => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        if (userToken) {
            axiosInstance.get('/admin/schoolYear', {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            })
            .then(response => {
                setYears(response.data.listYear);
            })
            .catch(error => {
                console.error(error);
            });
        }
    }, []);

    const handleAddYear = () => {
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
            setYears([...years, response.data]);
            setNewYear('');
            setShowForm(false);
            toast.success('Thêm niên khóa thành công!');
        })
        .catch(error => {
            console.error(error);
            toast.error('Thêm niên khóa thất bại!');
        });
    };

    const handleEditYear = () => {
        if (!newYear.trim()) {
            toast.error('Tên niên khóa không được để trống!');
            return;
        }

        const userToken = getTokenFromUrlAndSaveToStorage();
        axiosInstance.post(`/admin/schoolYear/edit/${selectedYear.yearId}`, null, {
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
        })
        .catch(error => {
            console.error(error);
            toast.error('Chỉnh sửa niên khóa thất bại!');
        });
    };

    const handleViewYear = (year) => {
        setSelectedYear(year);
        setNewYear(year.year);
        setShowForm(true);
    };

    const handleDeleteYear = () => {

    }

    const handleExport = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        axiosInstance.get('/admin/schoolYear/export', {
            responseType: 'blob',
            headers: { 'Authorization': `Bearer ${userToken}` },
        })
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'school_years_report.xls');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Xuất báo cáo thành công!');
        })
        .catch(error => {
            console.error("Export error: ", error);
            toast.error('Xuất báo cáo thất bại!');
        });
    };

    const columns = [
        { field: 'yearId', headerName: 'ID', width: 100 },
        { field: 'year', headerName: 'Tên niên khóa', width: 200 },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEditYear(params.row)}
                    >
                        <EditOutlinedIcon />
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#F05454', marginLeft: 1 }}
                        onClick={() => handleDeleteYear(params.row)}
                    >
                        <DeleteOutlineOutlinedIcon />
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div className='table-years'>
            <ToastContainer />
            <div className='content-table'>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                        setSelectedYear(null);
                        setNewYear('');
                        setShowForm(true);
                    }}
                >
                    Add
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
                        <DialogTitle>{selectedYear ? 'CHỈNH SỬA NIÊN KHÓA' : 'THÊM NIÊN KHÓA'}</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Tên niên khóa"
                                type="text"
                                fullWidth
                                variant="standard"
                                required
                                value={newYear}
                                onChange={(e) => setNewYear(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setShowForm(false)}>Cancel</Button>
                            {selectedYear ? (
                                <Button onClick={handleEditYear}>Update</Button>
                            ) : (
                                <Button onClick={handleAddYear}>Add</Button>
                            )}
                        </DialogActions>
                    </Dialog>
                )}
                <div>
                    <DataGrid
                        rows={years.map((item, index) => ({ ...item, id: index + 1 }))}
                        columns={columns}
                        pageSize={5}
                        initialState={{
                            ...years.initialState,
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[10, 25, 50]}   
                    />
                </div>
            </div>
        </div>
    );
}

export default DataYears;
