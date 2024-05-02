import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import './dataTable.scss';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import { Toast } from 'react-bootstrap';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { DataGrid } from '@mui/x-data-grid';
import axiosInstance from '../../API/axios';
import moment from 'moment';

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
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [showAddToast, setShowAddToast] = useState(false);
    const [showErrorToastAdd, setShowErrorToastAdd] = useState(false);
    const [showDeleteToast, setShowDeleteToast] = useState(false);
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
        // Nếu trường nhập liệu là giới tính, cập nhật trực tiếp vào state formData
        const intValue = (name === 'id' || name === 'year') ? parseInt(value) : value;
        if (name === 'gender') {
            setFormData(prevState => ({
                ...prevState,
                [name]: value === 'Nữ' // Chuyển giá trị về true nếu là "Nữ", ngược lại là false
            }));
        } else {
            // Các trường nhập liệu khác
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmitAdd = () => {
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
                setShowAddToast(true);
            })
            .catch(error => {
                console.error(error);
                console.log("Lỗi");
                setShowErrorToastAdd(true);
            });
    };

    const handleGenderChange = (e) => {
        const value = e.target.value === 'Nữ' ? true : false;
        setGender(value);
    };

    const handleClassNameChange = (e) => {
        const value = e.target.value;
        setClassName(value);
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
                    // Xóa thành công
                    setStudents(prevState => prevState.filter(student => student.studentId !== studentId));
                    setShowConfirmation(false);
                    setShowConfirmationRestore(false);
                    setShowDeleteToast(true);
                    console.log('Xóa thành công');
                } else if (response.status === 404) {
                    console.log('Sinh viên không tồn tại.');
                } else if (response.status === 403) {
                    console.log('Truy cập bị từ chối.');
                }
            })
            .catch(error => {
                console.error("Lỗi khi xóa sinh viên:", error);
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
                setShowSuccessToast(true);
                setShowModal(false);
            })
            .catch(error => {
                console.error(error);
                setShowErrorToast(true);
            })
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserEdit(prevState => ({
            ...prevState,
            [name]: value
        }));
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
                            <button className='btnDelete' onClick={() => handleDelete(params.row)}>
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
            <div className='header-table'>
                <div className='btn-add'>
                    <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#AddStudent" style={{ marginBottom: '10px' }}>
                        Add
                    </button>
                </div>
                <button className='button-listDelete' onClick={() => setShowDeleteStudents(!showDeletedStudents)}>
                    {showDeletedStudents ? <><PlaylistAddCheckOutlinedIcon /> Dánh sách sinh viên</> : <><PlaylistRemoveOutlinedIcon /> Dánh sách sinh viên đã xóa</>}
                </button>
            </div>
            {showDeletedStudents && (
                <DataGrid
                    rows={students.filter(student => !student.person.status).map((student, index) => ({
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
                    rows={students.filter(student => student.person.status).map((student, index) => ({
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

            <Modal show={showConfirmation} onHide={cancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa sinh viên</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa sinh viên này không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelDelete}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={confirmDelete}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirmationRestore} onHide={cancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa sinh viên</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn khôi phục lại sinh viên này không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelDelete}>
                        Hủy
                    </Button>
                    <Button variant="primary">
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>

            <Toast show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto">Thông báo</strong>
                </Toast.Header>
                <Toast.Body>
                    <DoneOutlinedIcon /> Cập nhật thông tin thành công!
                </Toast.Body>
            </Toast>

            <Toast show={showDeleteToast} onClose={() => setShowDeleteToast(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto">Thông báo</strong>
                </Toast.Header>
                <Toast.Body>
                    <DoneOutlinedIcon /> Xóa sinh viên thành công!
                </Toast.Body>
            </Toast>

            <Toast show={showErrorToast} onClose={() => setShowErrorToast(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto" style={{ color: 'red' }}><ErrorOutlineOutlinedIcon /> Lỗi</strong>
                </Toast.Header>
                <Toast.Body>
                    Đã xảy ra lỗi khi cập nhật thông tin!
                </Toast.Body>
            </Toast>

            <Toast show={showAddToast} onClose={() => setShowAddToast(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto">Thông báo</strong>
                </Toast.Header>
                <Toast.Body>
                    <DoneOutlinedIcon /> Thêm sinh viên thành công!
                </Toast.Body>
            </Toast>

            <Toast show={showErrorToastAdd} onClose={() => setShowErrorToastAdd(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto" style={{ color: 'red' }}><ErrorOutlineOutlinedIcon /> Lỗi</strong>
                </Toast.Header>
                <Toast.Body>
                    Thêm sinh viên không thành công!
                </Toast.Body>
            </Toast>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg modal-dialog modal-dialog-scrollable">
                    <div className="modal-content was-validated">
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
                                <input required type="text" className="form-control" id="address" name="address" value={userEdit.address} onChange={handleChange} />
                            </div>
                            <div className='row mb-3'>
                                <div className="col">
                                    <label htmlFor="class" className="form-label">Lớp</label>
                                    <select required className="form-select" id="classes" value={userEdit.classes} onChange={handleClassNameChange} name="classes">
                                        <option value="">{userEdit.classes}</option>
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
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitEdit}>
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="modal fade" id="AddStudent" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: showModalAdd ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content was-validated">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">THÊM SINH VIÊN</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="id" className="form-label">MSSV</label>
                                <input type="text" className="form-control" id="id" name="personId" value={formData.personId} onChange={handleChangeAdd} required />
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
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <label htmlFor='genderAdd' className="form-label">Giới tính</label>
                                    <div style={{ display: 'flex' }}>
                                        <div>
                                            <input type="radio" id="nam" name="gender" value="Nam" checked={formData.gender === false} onChange={handleChangeAdd} />
                                            <label htmlFor="nam">Nam</label>
                                        </div>
                                        <div>
                                            <input type="radio" id="nu" name="gender" value="Nữ" checked={formData.gender === true} onChange={handleChangeAdd} />
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
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitAdd}>Thêm</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default DataTable;
