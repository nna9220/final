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

function DataTable() {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [guest, setGuest] = useState([]);
    const [years, setYear] = useState([]);
    const [major, setMajr] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDeletedStudents, setShowDeleteStudents] = useState(false);
    const [userEdit, setUserEdit] = useState({
        personId: '',
        firstName: '',
        lastName: '',
        birthDay: '',
        phone: '',
        gender: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [showAddToast, setShowAddToast] = useState(false);
    const [showErrorToastAdd, setShowErrorToastAdd] = useState(false);
    const [showDeleteToast, setShowDeleteToast] = useState(false);
    const [gender, setGender] = useState(false);
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
        console.log(formData)
        axios.post('/api/admin/student/create',
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

    const handleDelete = (row) => {
        setSelectedRow(row);
        setShowConfirmation(true);
    };

    const confirmDelete = () => {
        const studentId = selectedRow.studentId;
        axios.post(`/api/admin/student/delete/${studentId}`, {}, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
            }
        })
            .then(response => {
                if (response.status === 200) {
                    // Xóa thành công
                    setStudents(prevState => prevState.filter(student => student.studentId !== studentId));
                    setShowConfirmation(false);
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
    };

    const [isDataFetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        if (!isDataFetched) {
            const tokenSt = sessionStorage.getItem('userToken');
            if (tokenSt) {
                axios.get('/api/admin/student', {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`,
                    },
                })
                    .then(response => {
                        const studentsArray = response.data.students || [];
                        setStudents(studentsArray);
                        const GuestArray = response.data.guest || [];
                        setGuest(GuestArray);
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



    const handleEdit = (student) => {
        setUserEdit(student.person);
        setGender(student.person.gender);
        setShowModal(true);
    };

    const handleSubmitEdit = () => {
        const id = userEdit.personId; // Sử dụng thông tin từ state userEdit
        const formDataEdit = new FormData();
        formDataEdit.append('personId', userEdit.personId);
        formDataEdit.append('firstName', userEdit.firstName);
        formDataEdit.append('lastName', userEdit.lastName);
        formDataEdit.append('birthDay', userEdit.birthDay);
        formDataEdit.append('phone', userEdit.phone);
        formDataEdit.append('gender', gender);

        axios.post(`/api/admin/student/edit/${id}`, formDataEdit, {
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
                                gender: gender
                            }
                        };
                    }
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

    return (
        <div>
            <div className='header-table'>
                <div className='btn-add'>
                    <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#AddStudent">
                        Add
                    </button>
                </div>
                <button className='button-listDelete' onClick={() => setShowDeleteStudents(!showDeletedStudents)}>
                    {showDeletedStudents ? <><PlaylistAddCheckOutlinedIcon /> Dánh sách sinh viên</> : <><PlaylistRemoveOutlinedIcon /> Dánh sách sinh viên đã xóa</>}
                </button>
            </div>
            {showDeletedStudents && (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">MSSV</th>
                            <th scope="col">Họ và tên</th>
                            <th scope="col">Giới tính</th>
                            <th scope="col">Số điện thoại</th>
                            <th scope="col">Lớp</th>
                            <th scope="col">Niên khóa</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.filter(student => student.person.status === false)
                            .map((student, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{student.studentId}</td>
                                    <td>{student.person.firstName} {student.person.lastName}</td>
                                    <td>{student.person.gender ? 'Nữ' : 'Nam'}</td>
                                    <td>{student.person.phone}</td>
                                    <td>{student.studentClass.classname}</td>
                                    <td>{student.schoolYear.year}</td>
                                    <td>
                                        <button className='btnView'><RestoreOutlinedIcon /></button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}

            {!showDeletedStudents && (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">MSSV</th>
                            <th scope="col">Họ và tên</th>
                            <th scope="col">Giới tính</th>
                            <th scope="col">Số điện thoại</th>
                            <th scope="col">Lớp</th>
                            <th scope="col">Niên khóa</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.filter(student => student.person.status === true)
                            .map((student, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{student.studentId}</td>
                                    <td>{student.person.firstName} {student.person.lastName}</td>
                                    <td>{student.person.gender ? 'Nữ' : 'Nam'}</td>
                                    <td>{student.person.phone}</td>
                                    <td>{student.studentClass.classname}</td>
                                    <td>{student.schoolYear.year}</td>
                                    <td>
                                        <button className="btnView" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEdit(student)}>
                                            <EditOutlinedIcon />
                                        </button>
                                        <button className='btnDelete' onClick={() => handleDelete(student)}>
                                            <DeleteRoundedIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}

            {!showDeletedStudents && (
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Guest ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Action</th>
                        {/* Add more columns as needed */}
                    </tr>
                    </thead>
                    <tbody>
                    {guest.map((guest, index) => (
                        <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{guest.username}</td>
                            <td>{guest.personId}</td>
                            {/* Add more cells for additional guest data */}
                            <td>
                                <button className="btnView" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEdit(guest)}>
                                    <EditOutlinedIcon />
                                </button>
                                <button className='btnDelete' onClick={() => handleDelete(guest)}>
                                    <DeleteRoundedIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel1">CẬP NHẬT THÔNG TIN SINH VIÊN</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">Họ</label>
                                <input type="text" className="form-control" id="firstName" name="firstName" value={userEdit.firstName} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor='lastName' className="form-label">Tên</label>
                                <input type="text" className="form-control" id="lastName" name="lastName" value={userEdit.lastName} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor='gender' className="form-label">Giới tính</label>
                                <div>
                                    <input type="radio" id="nam" name="gender" value="Nam" checked={gender === false} onChange={handleGenderChange} />
                                    <label htmlFor="nam">Nam</label>
                                </div>
                                <div>
                                    <input type="radio" id="nu" name="gender" value="Nữ" checked={gender === true} onChange={handleGenderChange} />
                                    <label htmlFor="nu">Nữ</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor='brithDay' className="form-label">Ngày sinh</label>
                                <input type="text" className="form-control" id="brithDay" name="birthDay" value={userEdit.birthDay} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor='phone' className="form-label">Số điện thoại</label>
                                <input type="text" className="form-control" id="phone" name="phone" value={userEdit.phone} onChange={handleChange} />
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
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">THÊM SINH VIÊN</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="id" className="form-label">MSSV</label>
                                <input type="text" className="form-control" id="id" name="personId" value={formData.personId} onChange={handleChangeAdd} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">Họ</label>
                                <input type="text" className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={handleChangeAdd} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Tên</label>
                                <input type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={handleChangeAdd} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChangeAdd} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Số điện thoại</label>
                                <input type="text" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChangeAdd} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor='genderAdd' className="form-label">Giới tính</label>
                                <div>
                                    <input type="radio" id="nam" name="gender" value="Nam" checked={formData.gender === false} onChange={handleChangeAdd} />
                                    <label htmlFor="nam">Nam</label>
                                </div>
                                <div>
                                    <input type="radio" id="nu" name="gender" value="Nữ" checked={formData.gender === true} onChange={handleChangeAdd} />
                                    <label htmlFor="nu">Nữ</label>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="birthDay" className="form-label">Ngày sinh</label>
                                <input type="text" className="form-control" id="birthDay" name="birthDay" value={formData.birthDay} onChange={handleChangeAdd} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="major" className="form-label">Chuyên ngành</label>
                                <select className="form-select" id="major" value={formData.major.name} onChange={handleChangeAdd} name="major">
                                    {major.map((majorItem, index) => (
                                        <option key={index} value={majorItem}>{majorItem}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="class" className="form-label">Lớp</label>
                                <select className="form-select" id="class" value={formData.id.id} onChange={handleChangeAdd} name="id">
                                    {classes.map((classItem, index) => (
                                        <option key={index} value={classItem.id}>{classItem.classname}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="year" className="form-label">Niên khóa</label>
                                <select className="form-select" id="year" value={formData.year} onChange={handleChangeAdd} name="year">
                                    {years.map((yearItem, index) => (
                                        <option key={index} value={yearItem.yearId}>{yearItem.year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModalAdd(false)}>Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmitAdd}>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default DataTable;