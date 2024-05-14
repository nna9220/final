import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';
import axiosInstance from '../../../API/axios';
import './topicPb.scss'

function TopicKLPBTableHead() {
    const [topics, setTopics] = useState([]);
    const [detail, setDetail] = useState('');
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [scores, setScores] = useState({
        criteria1: 0,
        criteria2: 0,
        criteria3: 0,
        criteria4: 0,
        criteria5: 0,
        criteria6: 0
    });

    const handleScoreChange = (criteria, value) => {
        setScores(prevScores => ({
            ...prevScores,
            [criteria]: parseFloat(value) || 0 // Update the score for the specified criteria
        }));
    };
    const totalScore = Object.values(scores).reduce((total, score) => total + score, 0);

    useEffect(() => {
        console.log("TokenTopic: " + userToken);
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                axiosInstance.get('/head/graduation/manager/counterArgumentSubject', {
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
            }
        }
    }, [userToken]);

    const detailTopic = (id) => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log("Token: " + userToken);
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                axiosInstance.get(`/head/graduation/manager/counterArgumentSubject/detail/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                })
                    .then(response => {
                        console.log("DetailTopic: ", response.data);
                        setDetail(response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
    }

    const addScore = (id) => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        console.log("Token: " + userToken);
        if (userToken) {
            const tokenSt = sessionStorage.getItem(userToken);
            if (!tokenSt) {
                axiosInstance.post(`/head/graduation/manager/addScore/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    },
                })
                    .then(response => {
                        console.log("DetailTopic: ", response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
    }

    return (
        <div>
            <div>
                <div className='home-table-topicPB'>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col" style={{ width: '250px' }}>Tên đề tài</th>
                                <th scope="col">Giảng viên hướng dẫn</th>
                                <th scope="col">Sinh viên 1</th>
                                <th scope="col">Sinh viên 2</th>
                                <th scope="col">Sinh viên 3</th>
                                <th scope="col">Yêu cầu</th>
                                <th scope='col'>Chấm điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topics.map((item, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{item.subjectName}</td>
                                    <td>{item.instructorId?.person?.firstName + ' ' + item.instructorId?.person?.lastName}</td>
                                    <td>{item.student1}</td>
                                    <td>{item.student2}</td>
                                    <td>{item.student3}</td>
                                    <td>{item.requirement}</td>
                                    <td>
                                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => detailTopic(item.subjectId)}>
                                            <CreditScoreOutlinedIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Đánh giá</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <h5>Thông tin đề tài</h5>
                            <div>
                                <p>1. Tên đề tài: {detail.subject?.subjectName}</p>
                                <p>2. Chuyên ngành: {detail.subject?.major}</p>
                                <p>3. Loại đề tài: {detail.subject?.typeSubject?.typeName}</p>
                                <p>4. Giảng viên hướng dẫn: {detail.subject?.instructorId?.person?.firstName + ' ' + detail.subject?.instructorId?.person?.lastName}</p>
                                <p>5. Giảng viên phản biện: {detail.subject?.thesisAdvisorId?.person?.firstName + ' ' + detail.subject?.thesisAdvisorId?.person?.lastName}</p>
                                <p>6. Nhóm sinh viên thực hiện: </p>
                                <p>Sinh viên 1: {detail.subject?.student1}</p>
                                <p>Sinh viên 2: {detail.subject?.student2}</p>
                                <p>Sinh viên 3: {detail.subject?.student3}</p>
                            </div>
                            <hr></hr>
                            <h5>Tiêu chí đánh giá</h5>
                            <table className='table-bordered table'>
                                <thead>
                                    <tr>
                                        <th>Tiêu Chí Đánh Giá</th>
                                        <th>Sinh viên 1</th>
                                        <th>Sinh viên 2</th>
                                        <th>Sinh viên 3</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(scores).map(criteria => (
                                        <tr key={criteria}>
                                            <td className='criteria'>{criteria}</td>
                                            <td>
                                                <input type='number' step='0.25' max={1} min={0} value={scores[criteria]}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value);
                                                        if (value > 1) {
                                                            handleScoreChange(criteria, 1);
                                                        } else {
                                                            handleScoreChange(criteria, value);
                                                        }
                                                    }}
                                                />

                                            </td>
                                            <td>
                                                <input type='number' step='0.25' max={1} min={0} value={scores[criteria]}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value);
                                                        if (value > 1) {
                                                            handleScoreChange(criteria, 1);
                                                        } else {
                                                            handleScoreChange(criteria, value);
                                                        }
                                                    }}
                                                />

                                            </td>
                                            <td>
                                                <input type='number' step='0.25' max={1} min={0} value={scores[criteria]}
                                                    onChange={(e) => {
                                                        const value = parseFloat(e.target.value);
                                                        if (value > 1) {
                                                            handleScoreChange(criteria, 1);
                                                        } else {
                                                            handleScoreChange(criteria, value);
                                                        }
                                                    }}
                                                />

                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td className='criteria-sum'>Tổng</td>
                                        <td><input type='number' step='0.25' max={1} min={0} className='score' readOnly value={totalScore.toFixed(2)}></input></td>
                                        <td><input type='number' step='0.25' max={1} min={0} className='score' readOnly value={totalScore.toFixed(2)}></input></td>
                                        <td><input type='number' step='0.25' max={1} min={0} className='score' readOnly value={totalScore.toFixed(2)}></input></td>

                                    </tr>
                                </tbody>
                            </table>

                            <hr></hr>
                            <h5>Nhận xét, đánh giá</h5>
                            <div class="form-floating">
                                <textarea class="form-control" id="comment" name="text" placeholder="Comment goes here"></textarea>
                                <label for="comment">Nhận xét</label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={addScore}>Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopicKLPBTableHead