import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './dataTable.scss';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../API/axios';
import moment from 'moment';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DataTable() {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [years, setYear] = useState([]);
    const [major, setMajr] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showConfirmationRestore, setShowConfirmationRestore] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDeletedStudents, setShowDeleteStudents] = useState(false);
    const [userEdit, setUserEdit] = useState({
        personId: '',
        firstName: '',
        lastName: '',
        birthDay: '',
        phone: '',
        gender: '',
        username: '',
        address: '',
        status: '',
        classes: '',
    });
    const [IdOld, setIdOld] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [studentName, setStudentName] = useState();
    const [gender, setGender] = useState(false);
    const [classname, setClassName] = useState(false);
    const [formData, setFormData] = useState({
        personId: '',
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        birthDay: '',
        phone: '',
        major: '',
        id: '',
        year: '',
    });


    const handleChangeAdd = (e) => {
        const { name, value } = e.target;
        if (name === 'gender') {
            setFormData(prevState => ({
                ...prevState,
                [name]: value === 'Nữ'
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmitAdd = (event) => {
        event.preventDefault();
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log(formData);
        axiosInstance.post('/admin/student/create',
            formData
            , {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(response => {
                console.log('Sinh viên đã được tạo thành công:', response.data);
                setShowModalAdd(false);
                toast.success("Thêm sinh viên thành công!")
            })
            .catch(error => {
                console.error(error);
                console.log("Lỗi");
                toast.error("Lỗi thêm sinh viên!")
            });
    };

    const handleGenderChange = (e) => {
        const value = e.target.value === 'Nữ' ? true : false;
        setGender(value);
    };

    const handleClassNameChange = (e) => {
        const value = e.target.value;
        setUserEdit(prevState => ({
            ...prevState,
            classes: value
        }));
    };    

    const handleDelete = (row) => {
        setSelectedRow(row);
        setShowConfirmation(true);
    };

    const handleRestore = (row) => {
        setSelectedRow(row);
        setShowConfirmationRestore(true);
    };

    const confirmDelete = () => {
        const studentId = selectedRow.studentId;
        axiosInstance.post(`/admin/student/delete/${studentId}`, {}, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
            }
        })
            .then(response => {
                if (response.status === 200) {
                    setStudents(prevState => prevState.filter(student => student.studentId !== studentId));
                    setShowConfirmation(false);
                    setShowConfirmationRestore(false);
                    console.log('Xóa thành công');
                    toast.success("Xóa thành công!");
                } else if (response.status === 404) {
                    console.log('Sinh viên không tồn tại.');
                    toast.error("Sinh viên không tồn tại");
                } else if (response.status === 403) {
                    console.log('Truy cập bị từ chối.');
                }
            })
            .catch(error => {
                console.error("Lỗi khi xóa sinh viên:", error);
                toast.error("Xóa sinh viên thất bại!")
            });
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
        setShowConfirmationRestore(false);
    };

    const [isDataFetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        if (!isDataFetched) {
            const tokenSt = sessionStorage.getItem('userToken');
            if (tokenSt) {
                axiosInstance.get('/admin/student', {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
                    },
                })
                    .then(response => {
                        const studentsArray = response.data.students || [];
                        setStudents(studentsArray);
                        const classArray = response.data.listClass || [];
                        setClasses(classArray);
                        const yearsArray = response.data.listYear || [];
                        setYear(yearsArray);
                        const majorArray = response.data.major || [];
                        setMajr(majorArray);
                        console.log("Data Student:  ", response.data);
                        setIsDataFetched(true); // Đánh dấu rằng dữ liệu đã được lấy
                    })
                    .catch(error => {
                        console.error("error: ", error);
                    });
            }
        }
    }, [isDataFetched]);

    const handleEdit = (id) => {
        console.log("id student", id);
        axiosInstance.get(`/admin/student/${id}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
            },
        })
            .then(response => {
                const data = response.data;
                if (data.student && data.student.person) {
                    const formattedDate = moment(data.student.person.birthDay, "YYYY-MM-DD").format("YYYY-MM-DD");
                    console.log("user tồn tại");
                    data.student.person.birthDay = formattedDate;
                    console.log("Student classs 1: ", data.student.studentClass.classname)
                    setUserEdit(prevState => ({
                        ...prevState,
                        personId: data.student.person.personId,
                        firstName: data.student.person.firstName,
                        lastName: data.student.person.lastName,
                        birthDay: data.student.person.birthDay,
                        phone: data.student.person.phone,
                        gender: data.student.person.gender,
                        username: data.student.person.username,
                        address: data.student.person.address,
                        status: data.student.person.status,
                        classes: data.student.studentClass.classname
                    }));
                    setGender(data.student.person.gender);
                    setClassName(data.student.studentClass.classname);
                    setIdOld(data.student.studentId);
                    setShowModal(true);
                } else {
                    console.log("Sinh viên không tồn tại.");
                }
            })
            .catch(error => {
                console.error("Lỗi khi lấy thông tin sinh viên:", error);
            });
    };


    const handleSubmitEdit = () => {
        const id = IdOld;
        const formDataEdit = new FormData();
        formDataEdit.append('personId', userEdit.personId);
        formDataEdit.append('firstName', userEdit.firstName);
        formDataEdit.append('lastName', userEdit.lastName);
        formDataEdit.append('birthDay', userEdit.birthDay);
        formDataEdit.append('phone', userEdit.phone);
        formDataEdit.append('username', userEdit.username);
        formDataEdit.append('address', userEdit.address);
        formDataEdit.append('status', userEdit.status);
        formDataEdit.append('gender', gender);
        formDataEdit.append('classes', userEdit.classes);

        console.log('personId', userEdit.personId);
        console.log('firstName', userEdit.firstName);
        console.log('lastName', userEdit.lastName);
        console.log('birthDay', userEdit.birthDay);
        console.log('phone', userEdit.phone);
        console.log('username', userEdit.username);
        console.log('address', userEdit.address);
        console.log('status', userEdit.status);
        console.log('gender', gender);
        console.log('classes', classname);

        axiosInstance.post(`/admin/student/edit/${id}`, formDataEdit, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
                'Content-Type': 'multipart/form-data'
            },
        })
            .then(response => {
                console.log("EditHeaderSuccess: ", response.data);
                const updatedStudents = students.map(student => {
                    if (student.person.personId === id) {
                        return {
                            ...student,
                            person: {
                                ...student.person,
                                firstName: userEdit.firstName,
                                lastName: userEdit.lastName,
                                birthDay: userEdit.birthDay,
                                phone: userEdit.phone,
                                gender: userEdit.gender,
                                username: userEdit.username,
                                address: userEdit.address
                            },
                            student: {
                                classes: userEdit.classes
                            }
                        };
                    }
                    console.log("Student: " + student);
                    return student;
                });
                setStudents(updatedStudents);
                toast.success("Chỉnh sửa sinh viên thành công!")
            })
            .catch(error => {
                toast.error("Chỉnh sửa sinh viên thất bại")
                setShowModal(false);
            })
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserEdit(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleExport = () => {
        const tokenSt = sessionStorage.getItem('userToken');
        axiosInstance.get('/admin/student/export', {
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
                toast.success("Xuất file thành công!")
            })
            .catch(error => {
                console.error("Export error: ", error);
                toast.error('Xuất file thất bại!')
            });
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'studentId', headerName: 'MSSV', width: 130 },
        { field: 'fullName', headerName: 'Họ và tên', width: 200 },
        { field: 'gender', headerName: 'Giới tính', width: 130 },
        { field: 'phone', headerName: 'Số điện thoại', width: 160 },
        { field: 'classes', headerName: 'Lớp', width: 130 },
        { field: 'schoolYear', headerName: 'Niên khóa', width: 130 },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <div>
                    {!showDeletedStudents && (
                        <>
                            <button className="btnView" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEdit(params.row.studentId)}>
                                <EditOutlinedIcon />
                            </button>
                            <button className='btnDelete' data-bs-toggle="modal" data-bs-target="#delete" onClick={() => { handleDelete(params.row); setStudentName(params.row.fullName) }}>
                                <DeleteRoundedIcon />
                            </button>
                        </>
                    )}

                    {showDeletedStudents && (
                        <button className='btnView' onClick={() => handleRestore(params.row)}>
                            <RestoreOutlinedIcon />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className='homeContainerSt'>
            <div className='content-table'>
                <ToastContainer />
                <div className='header-table'>
                    <div className='btn-add'>
                        <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#AddStudent" style={{ marginBottom: '10px', marginRight:'20px' }}>
                            Add
                        </button>

                        <button type="button" className="btn btn-primary" style={{ marginBottom: '10px' }} onClick={handleExport}>
                            <SaveAltIcon/>Export
                        </button>
                        
                    </div>
                    <button className='button-listDelete' onClick={() => setShowDeleteStudents(!showDeletedStudents)}>
                        {showDeletedStudents ? <><PlaylistAddCheckOutlinedIcon /> Dánh sách sinh viên</> : <><PlaylistRemoveOutlinedIcon /> Dánh sách sinh viên đã xóa</>}
                    </button>
                </div>
                {showDeletedStudents && (
                    <DataGrid
                        rows={students.filter(student => !student.person?.status).map((student, index) => ({
                            id: index + 1,
                            studentId: student.studentId,
                            fullName: `${student.person.firstName} ${student.person.lastName}`,
                            gender: student.person.gender ? 'Nữ' : 'Nam',
                            phone: student.person.phone,
                            classes: student.studentClass.classname,
                            schoolYear: student.schoolYear.year,
                        }))}
                        columns={columns}
                        initialState={{
                            ...students.initialState,
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[10, 25, 50]}

                    />
                )}

                {!showDeletedStudents && (
                    <DataGrid
                        rows={students.filter(student => student).map((student, index) => ({
                            id: index + 1,
                            studentId: student.studentId,
                            fullName: `${student.person?.firstName} ${student.person?.lastName}`,
                            gender: student.person?.gender ? 'Nữ' : 'Nam',
                            phone: student.person?.phone,
                            classes: student.studentClass.classname,
                            schoolYear: student.schoolYear.year,
                        }))}
                        columns={columns}
                        initialState={{
                            ...students.initialState,
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                    />
                )}

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true" style={{ display: showModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-lg modal-dialog modal-dialog-scrollable" onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmitEdit()
                    }}>
                        <form className="modal-content was-validated">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel1">CẬP NHẬT THÔNG TIN SINH VIÊN</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="id" className="form-label">MSSV</label>
                                    <input disabled type="text" className="form-control" id="personId" name="personId" value={userEdit.personId} onChange={handleChange} />
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="firstName" className="form-label">Họ</label>
                                        <input required type="text" className="form-control" id="firstName" name="firstName" value={userEdit.firstName} onChange={handleChange} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='lastName' className="form-label">Tên</label>
                                        <input required type="text" className="form-control" id="lastName" name="lastName" value={userEdit.lastName} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="id" className="form-label">Email</label>
                                    <input required type="text" className="form-control" id="username" name="username" value={userEdit.username} onChange={handleChange} />
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor='brithDay' className="form-label">Ngày sinh</label>
                                        <input required type="date" className="form-control" id="brithDay" name="birthDay" value={userEdit.birthDay} onChange={handleChange} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='phone' className="form-label">Số điện thoại</label>
                                        <input required type="text" className="form-control" id="phone" name="phone" value={userEdit.phone} onChange={handleChange} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor='gender' className="form-label">Giới tính</label>
                                        <div style={{ display: 'flex' }}>
                                            <div>
                                                <input type="radio" id="nam" name="gender" value="Nam" checked={gender === false} onChange={handleGenderChange} />
                                                <label htmlFor="nam">Nam</label>
                                            </div>
                                            <div>
                                                <input type="radio" id="nu" name="gender" value="Nữ" checked={gender === true} onChange={handleGenderChange} />
                                                <label htmlFor="nu">Nữ</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor='address' className="form-label">Địa chỉ</label>
                                    <input type="text" className="form-control" id="address" name="address" value={userEdit.address} onChange={handleChange} />
                                </div>
                                <div className='row mb-3'>
                                    <div className="col">
                                        <label htmlFor="class" className="form-label">Lớp</label>
                                        <select required className="form-select" id="classes" value={userEdit.classes} onChange={handleClassNameChange} name="classes">
                                            {classes.map((classItem, index) => (
                                                <option key={index} value={classItem.classname}>{classItem.classname}</option>
                                            ))}
                                        </select>

                                    </div>
                                    <div className="col">
                                        <label htmlFor='status' className="form-label">Trạng thái</label>
                                        <select required className="form-select" id="status" name="status">
                                            <option value="option1">True</option>
                                            <option value="option2">False</option>
                                        </select>
                                    </div>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" >
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="modal fade" id="AddStudent" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: showModalAdd ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-lg modal-dialog-scrollable" onSubmit={handleSubmitAdd}>
                        <form className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">THÊM SINH VIÊN</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="id" className="form-label">MSSV</label>
                                    <input required type="text" className="form-control" id="id" name="personId" value={formData.personId} onChange={handleChangeAdd} />
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="firstName" className="form-label">Họ</label>
                                        <input type="text" className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={handleChangeAdd} required />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="lastName" className="form-label">Tên</label>
                                        <input type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={handleChangeAdd} required />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChangeAdd} required />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="phone" className="form-label">Số điện thoại</label>
                                        <input type="text" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChangeAdd} required />
                                        <div class="form-text">Số điện thoại gồm 10 số.</div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor='genderAdd' className="form-label">Giới tính</label>
                                        <div style={{ display: 'flex' }}>
                                            <div>
                                                <input required type="radio" id="nam" name="gender" value="Nam" checked={formData.gender === false} onChange={handleChangeAdd} />
                                                <label htmlFor="nam">Nam</label>
                                            </div>
                                            <div>
                                                <input required type="radio" id="nu" name="gender" value="Nữ" checked={formData.gender === true} onChange={handleChangeAdd} />
                                                <label htmlFor="nu">Nữ</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="birthDay" className="form-label">Ngày sinh</label>
                                        <input type="date" className="form-control" id="birthDay" name="birthDay" value={formData.birthDay} onChange={handleChangeAdd} required />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="major" className="form-label">Chuyên ngành</label>
                                        <select className="form-select" id="major" value={formData.major.name} onChange={handleChangeAdd} name="major" required>
                                            <option value="">Chọn ...</option>
                                            {major.map((majorItem, index) => (
                                                <option key={index} value={majorItem}>{majorItem}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="class" className="form-label">Lớp</label>
                                        <select className="form-select" id="class" value={formData.id.id} onChange={handleChangeAdd} name="id" required>
                                            <option value="">Chọn ...</option>
                                            {classes.map((classItem, index) => (
                                                <option key={index} value={classItem.id}>{classItem.classname}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="year" className="form-label">Niên khóa</label>
                                        <select className="form-select" id="year" value={formData.year} onChange={handleChangeAdd} name="year" required>
                                            <option value="">Chọn ...</option>
                                            {years.map((yearItem, index) => (
                                                <option key={index} value={yearItem.yearId}>{yearItem.year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModalAdd(false)}>Đóng</button>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Thêm</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="modal fade" id="delete" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Xóa sinh viên</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                Bạn chắc chắc muốn xóa sinh viên {studentName} không?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={confirmDelete}>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataTable;
