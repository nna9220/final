import React, { useState, useEffect } from 'react';
import './RegisTopicTable.scss';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
function RegisTopicTable() {
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log("Token: " + userToken);
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                axios.get('http://localhost:5000/api/student/subject', {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                })
                    .then(response => {
                        console.log("DatalistSubject: ", response.data);
                        setTopics(response.data.subjectList);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
    }, []);

    const dangKyDeTai = (subjectId) => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        axios.post(`http://localhost:5000/api/student/subject/registerTopic/${subjectId}`, null, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                if (response.status === 200) {
                    alert("Đăng ký thành công!");
                } else {
                    alert("Đăng ký thất bại! Vui lòng thử lại sau.");
                }
            })
            .catch(error => {
                console.error("Đăng ký thất bại", error);
                alert("Đăng ký thất bại! Vui lòng thử lại sau.");
            });
    };


    return (
        <div className='home-table'>
            <h4 className='title-table'>Danh sách đề tài</h4>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên đề tài</th>
                        <th scope="col">Giảng viên hướng dẫn</th>
                        <th scope="col">Đăng ký</th>
                    </tr>
                </thead>
                <tbody>
                    {topics.map((topic, index) => (
                        <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{topic.subjectName}</td>
                            <td>{topic.instructorId.person.firstName+' '+topic.instructorId.person.lastName}</td>
                            <td>
                                <button className="btnView" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    <EditCalendarOutlinedIcon />
                                </button>
    
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RegisTopicTable;
