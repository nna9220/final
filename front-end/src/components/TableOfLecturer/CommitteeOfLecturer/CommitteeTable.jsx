import React from 'react'
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import axiosInstance from '../../../API/axios';
import { useState, useEffect } from 'react';

function CommitteeTable() {
    const [topics, setTopics] = useState([]);
    const userToken = getTokenFromUrlAndSaveToStorage();
    const [subjectIdDetail, setSubjectIdDetail] = useState(null)

    useEffect(() => {
        listTopic();
    }, [userToken]);

    const listTopic = () => {
        axiosInstance.get('/lecturer/council/listSubject', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
            .then(response => {
                console.log("TopicTL: ", response.data);
                setTopics(response.data.body);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const detailTopic = () => {
        axiosInstance.get(`/lecturer/council/detail/${subjectIdDetail}`, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            }
        })
            .then(response => {
                console.log("TopicTL: ", response.data);
                setTopics(response.data.body);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <div style={{ margin: '20px' }}>
            <div className='body-table-committe'>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên đề tài</th>
                            <th scope='col'>GVHD</th>
                            <th scope='col'>GVPB</th>
                            <th scope='col'>SV 1</th>
                            <th scope='col'>SV 2</th>
                            <th scope='col'>SV 3</th>
                            <th scope='col'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.map((item, index) => (
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item.subject?.subjectName}</td>
                                <td>{item.subject?.instructorId?.person?.firstName + ' ' + item.subject?.instructorId?.person?.lastName}</td>
                                <td>{item.subject?.thesisAdvisorId?.person?.firstName + ' ' + item.subject?.thesisAdvisorId?.person?.lastName}</td>
                                <td>{item.subject?.student1}</td>
                                <td>{item.subject?.student2}</td>
                                <td>{item.subject?.student3}</td>
                                <td>
                                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        Đánh giá
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Đánh giá</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="time" class="form-label">Thời gian</label>
                                <input type="datetime-local" class="form-control" id="time" />
                            </div>
                            <h6>Danh sách thành viên hội đồng: </h6>
                            <div>
                                <table className='table-bordered table'>
                                    <thead>
                                        <tr>
                                            <th>Số thứ tự</th>
                                            <th>Thành viên</th>
                                            <th>Họ và tên</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Thành viên 1</td>
                                            <td>
                                                <select>
                                                    <option value="giang-vien-1">Giảng viên 1</option>
                                                    <option value="giang-vien-2">Giảng viên 2</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>Thành viên 2</td>
                                            <td>
                                                <select>
                                                    <option value="giang-vien-1">Giảng viên 1</option>
                                                    <option value="giang-vien-2">Giảng viên 2</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Thành viên 3 </td>
                                            <td>
                                                <select>
                                                    <option value="giang-vien-1">Giảng viên 1</option>
                                                    <option value="giang-vien-2">Giảng viên 2</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>Thành viên 4</td>
                                            <td>
                                                <select>
                                                    <option value="giang-vien-1">Giảng viên 1</option>
                                                    <option value="giang-vien-2">Giảng viên 2</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>5</td>
                                            <td>Thành viên 5</td>
                                            <td>
                                                <select>
                                                    <option value="giang-vien-1">Giảng viên 1</option>
                                                    <option value="giang-vien-2">Giảng viên 2</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommitteeTable