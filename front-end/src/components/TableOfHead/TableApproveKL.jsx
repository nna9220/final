import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import './TableApprove.scss';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import { Toast } from 'react-bootstrap';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';

function TableApproveKL() {
  const [topics, setTopics] = useState([]);
    const [topicsDeleted, setTopicsDeleted] = useState([]);
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [showTable, setShowTable] = useState(false);
    const [showDeleteToast, setShowDeleteToast] = useState(false);
    const [showErrorToastDelete, setShowErrorToastDelete] = useState(false);
    const [showApproveToast, setShowApproveToast] = useState(false);
    const [showErrorToastApprove, setShowErrorToastApprove] = useState(false);

    useEffect(() => {
        console.log("Token: " + userToken);
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                loadListDelete();
                loadTopics();
            }
        }
    }, [userToken]);

    const loadTopics = () => {
        axios.get('/api/head/subjectGraduation', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Topic: ", response.data);
                setTopics(response.data.listSubject);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const loadListDelete = () => {
        axios.get('/api/head/subject/delete', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Topic deleted: ", response.data);
                loadTopics();
                setTopicsDeleted(response.data.lstSubject);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleApprove = (id) => {
        axios.post(`/api/head/subjectGraduation/browse/${id}`, null, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Duyệt thành công");
                loadTopics(); // Load lại danh sách sau khi duyệt thành công
                setShowApproveToast(true);
            })
            .catch(error => {
                console.error("Lỗi khi duyệt đề tài: ", error);
                setShowErrorToastApprove(true);
            });
    };

    const handleDelete = (id) => {
        axios.post(`/api/head/subject/delete/${id}`, null, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Xóa thành công");
                loadTopics(); // Load lại danh sách sau khi duyệt thành công
                setShowDeleteToast(true);
            })
            .catch(error => {
                console.error("Lỗi khi xóa đề tài: ", error);
                setShowErrorToastDelete(true);
            });
    }

    return (
        <div className='body-table'>
             <Toast show={showDeleteToast} onClose={() => setShowDeleteToast(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto">Thông báo</strong>
                </Toast.Header>
                <Toast.Body>
                    <DoneOutlinedIcon /> Đề tài đã được xóa!
                </Toast.Body>
            </Toast>

            <Toast show={showErrorToastDelete} onClose={() => setShowErrorToastDelete(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto" style={{ color: 'red' }}><ErrorOutlineOutlinedIcon /> Lỗi</strong>
                </Toast.Header>
                <Toast.Body>
                    Xóa đề tài không thành công!
                </Toast.Body>
            </Toast>
            
            <Toast show={showApproveToast} onClose={() => setShowApproveToast(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto">Thông báo</strong>
                </Toast.Header>
                <Toast.Body>
                    <DoneOutlinedIcon /> Đề tài đã được duyệt!
                </Toast.Body>
            </Toast>

            <Toast show={showErrorToastApprove} onClose={() => setShowErrorToastApprove(false)} delay={3000} autohide style={{ position: 'fixed', top: '80px', right: '10px' }}>
                <Toast.Header>
                    <strong className="me-auto" style={{ color: 'red' }}><ErrorOutlineOutlinedIcon /> Lỗi</strong>
                </Toast.Header>
                <Toast.Body>
                    Duyệt đề tài không thành công!
                </Toast.Body>
            </Toast>

            <button className='button-listDelete' onClick={() => setShowTable(!showTable)}>
                    {showTable ? <><PlaylistAddCheckOutlinedIcon /> Dánh sách đề tài chưa duyệt</> : <><PlaylistRemoveOutlinedIcon /> Dánh sách đề tài đã xóa</>}
            </button>

            {showTable ? (
                <div>
                    <div className='home-table'>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Tên đề tài</th>
                                    <th scope="col">Giảng viên hướng dẫn</th>
                                    <th scope="col">Sinh viên 1</th>
                                    <th scope="col">Sinh viên 2</th>
                                    <th scope="col">Yêu cầu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topicsDeleted.map((itemDelete, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{itemDelete.subjectName}</td>
                                        <td>{itemDelete.instructorId.person.firstName + ' ' + itemDelete.instructorId.person.lastName}</td>
                                        <td>{itemDelete.student1 === null ? 'Trống' : ''}</td>
                                        <td>{itemDelete.student2 === null ? 'Trống' : ''}</td>
                                        <td>{itemDelete.requirement}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className='home-table'>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tên đề tài</th>
                                <th scope="col">Giảng viên hướng dẫn</th>
                                <th scope="col">Sinh viên 1</th>
                                <th scope="col">Sinh viên 2</th>
                                <th scope="col">Yêu cầu</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topics.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item.subjectName}</td>
                                    <td>{item.instructorId.person.firstName + ' ' + item.instructorId.person.lastName}</td>
                                    <td>{item.student1}</td>
                                    <td>{item.student2}</td>
                                    <td>{item.requirement}</td>
                                    <td style={{ display: 'flex' }}>
                                        <button style={{ marginRight: '20px' }} className='button-res' onClick={() => handleApprove(item.subjectId)}>
                                            <p className='text'>Duyệt</p>
                                        </button>
                                        <button className='button-res-de' onClick={() => handleDelete(item.subjectId)}>
                                            <p className='text'>Xóa</p>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default TableApproveKL