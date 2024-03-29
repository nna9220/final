import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import './styleTable.scss';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';

function TableApprove() {
    const [topics, setTopics] = useState([]);
    const [topicsDeleted, setTopicsDeleted] = useState([]);
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [showTable, setShowTable] = useState(false);

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
        axios.get('http://localhost:5000/api/head/subject', {
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
        axios.get('http://localhost:5000/api/head/subject/delete', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Topic deleted: ", response.data);
                setTopicsDeleted(response.data.lstSubject);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleApprove = (id) => {
        axios.post(`http://localhost:5000/api/head/subject/browse/${id}`, null, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Duyệt thành công");
                loadTopics(); // Load lại danh sách sau khi duyệt thành công
            })
            .catch(error => {
                console.error("Lỗi khi duyệt đề tài: ", error);
            });
    };

    const handleDelete = (id) => {
        axios.post(`http://localhost:5000/api/head/subject/delete/${id}`, null, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Xóa thành công");
                loadTopics(); // Load lại danh sách sau khi duyệt thành công
            })
            .catch(error => {
                console.error("Lỗi khi xóa đề tài: ", error);
            });
    }

    return (
        <div>
            <div className='header-table'>
                <button className='btn-list' onClick={() => setShowTable(!showTable)}><ListAltOutlinedIcon />Danh sách đề tài bị xóa</button>
            </div>

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
                                    <td>{item.student1 === null ? 'Trống' : ''}</td>
                                    <td>{item.student2 === null ? 'Trống' : ''}</td>
                                    <td>{item.requirement}</td>
                                    <td style={{ display: 'flex' }}>
                                        <button style={{ marginRight: '20px' }} className='button-res' onClick={() => handleApprove(item.subjectId)}>
                                            <p className='text'>Duyệt</p>
                                        </button>
                                        <button className='button-res' onClick={() => handleDelete(item.subjectId)}>
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

export default TableApprove;
