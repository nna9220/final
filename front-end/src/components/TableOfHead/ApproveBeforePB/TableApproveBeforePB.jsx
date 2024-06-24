import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import './TableApprove.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../API/axios';

function TableApproveBeforePB() {
    const [topics, setTopics] = useState([]);
    const [timeApprove, setTimeApprove] = useState([]);
    const [currentPeriod, setCurrentPeriod] = useState(null);
    const [topicName, setTopicName] = useState('');
    const [subjectIdForApproval, setSubjectIdForApproval] = useState(null);

    const userToken = getTokenFromUrlAndSaveToStorage();

    useEffect(() => {
        if (userToken) {
            loadTopics();
            loadTimeApprove();
        }
    }, [userToken]);

    useEffect(() => {
        if (timeApprove.length > 0) {
            const currentDate = new Date();
            const currentDateTime = currentDate.getTime();
            const currentPeriod = timeApprove.find(time => {
                const startTime = convertStringToDate(time.timeStart).getTime();
                const endTime = convertStringToDate(time.timeEnd).getTime();
                return currentDateTime >= startTime && currentDateTime <= endTime;
            });
            setCurrentPeriod(currentPeriod);
        }
    }, [timeApprove]);

    const loadTopics = () => {
        axiosInstance.get('/head/browseThesis/listSubject', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Data subject: ", response.data.body)
                setTopics(response.data.body);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const loadTimeApprove = () => {
        axiosInstance.get('/head/browseThesis/timeBrowse', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                setTimeApprove(response.data.timeBrowse || []);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleApproveSubject = () => {
        axiosInstance.post(`/head/browseThesis/accept-subject-to-thesis/${subjectIdForApproval}`, {}, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                toast.success("Đề tài đã được chấp nhận và chuyển đến GVPB!");
                loadTopics();
            })
            .catch(error => {
                toast.error("Lỗi khi duyệt đề tài");
                console.error('Error approving subject:', error);
            });
    };


    const isWithinApprovalPeriod = () => {
        const now = new Date();
        if (currentPeriod) {
            const timeStart = convertStringToDate(currentPeriod.timeStart);
            const timeEnd = convertStringToDate(currentPeriod.timeEnd);
            return now >= timeStart && now <= timeEnd;
        }
        return false;
    };

    function convertStringToDate(dateTimeString) {
        const [datePart, timePart] = dateTimeString.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hour, minute, second] = timePart.split(':');
        return new Date(year, month - 1, day, hour, minute, second);
    }

    return (
        <div className='body-table'>
            <ToastContainer />
            {isWithinApprovalPeriod() ? (
                <>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tên đề tài</th>
                                <th scope="col">GVHD</th>
                                <th scope="col">GVPB</th>
                                <th scope="col">SV1</th>
                                <th scope="col">SV2</th>
                                <th scope="col">SV3</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topics.filter(item => item.active === 6).map((item, index) => (
                                <tr>
                                    <th scope="row">{index + 1}</th>
                                    <td> {item.subjectName}</td>
                                    <td> {item.instructorId?.person?.firstName + ' ' + item.instructorId?.person?.lastName}</td>
                                    <td> {item.thesisAdvisorId?.person?.firstName + ' ' + item.thesisAdvisorId?.person?.lastName}</td>
                                    <td> {item.student1}</td>
                                    <td> {item.student2}</td>
                                    <td> {item.student3}</td>
                                    <td>
                                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#ConfirmApproval" onClick={() => {setTopicName(item.subjectName); setSubjectIdForApproval(item.subjectId)}}>
                                            Duyệt
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <div className='alert-danger-approve'>
                    <p>Không nằm trong thời gian duyệt đề tài trước khi phản biện !!!</p>
                </div>
            )}

            <div>
                <div class="modal fade" id="ConfirmApproval" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Duyệt đề tài qua hội đồng</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                Bạn chắc chắn muốn duyệt đề tài {topicName} qua hội đồng không?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleApproveSubject}>Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TableApproveBeforePB;
