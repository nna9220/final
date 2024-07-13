import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import './TableApprove.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../API/axios';

function TableApproveBeforePB() {
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [userToken, setUserToken] = useState(getTokenFromUrlAndSaveToStorage());

    useEffect(() => {
        if (userToken) {
            loadTopics();
        }
    }, [userToken]);

    const loadTopics = () => {
        axiosInstance.get('/head/browseThesis/listSubject', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
            .then(response => {
                console.log("Data subject: ", response.data.body);
                setTopics(response.data.body);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleApproveSubjects = () => {
        axiosInstance.post('/head/browseThesis/accept-multiple-subjects', selectedTopics, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            toast.success("Các đề tài đã được chấp nhận và chuyển đến GVPB!");
            loadTopics();
            setSelectedTopics([]); // Xóa các đề tài đã chọn
        })
        .catch(error => {
            toast.error("Lỗi khi duyệt đề tài");
            console.error('Error approving subjects:', error.response.data);
        });
    };

    const handleSelectTopic = (subjectId) => {
        setSelectedTopics(prevSelectedTopics => 
            prevSelectedTopics.includes(subjectId) 
            ? prevSelectedTopics.filter(id => id !== subjectId) 
            : [...prevSelectedTopics, subjectId]
        );
    };

    return (
        <div className='body-table'>
            <ToastContainer />
            <div className="header" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                    type="button" 
                    className="btn btn-primary" 
                    data-bs-toggle="modal" 
                    data-bs-target="#confirmModal" 
                    disabled={selectedTopics.length === 0}
                >
                    Duyệt các đề tài đã chọn
                </button>
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Chọn</th>
                        <th scope="col">Tên đề tài</th>
                        <th scope="col">GVHD</th>
                        <th scope="col">GVPB</th>
                        <th scope="col">SV1</th>
                        <th scope="col">SV2</th>
                        <th scope="col">SV3</th>
                    </tr>
                </thead>
                <tbody>
                    {topics.filter(item => item.active === 6).map((item, index) => (
                        <tr key={item.subjectId}>
                            <th scope="row">{index + 1}</th>
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={selectedTopics.includes(item.subjectId)} 
                                    onChange={() => handleSelectTopic(item.subjectId)} 
                                />
                            </td>
                            <td>{item.subjectName}</td>
                            <td>{item.instructorId?.person?.firstName + ' ' + item.instructorId?.person?.lastName}</td>
                            <td>{item.thesisAdvisorId?.person?.firstName + ' ' + item.thesisAdvisorId?.person?.lastName}</td>
                            <td>{item.student1}</td>
                            <td>{item.student2}</td>
                            <td>{item.student3}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Bootstrap Modal */}
            <div className="modal fade" id="confirmModal" tabIndex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="confirmModalLabel">Xác nhận duyệt các đề tài</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Bạn có chắc chắn muốn duyệt các đề tài đã chọn không?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" className="btn btn-primary" onClick={handleApproveSubjects} data-bs-dismiss="modal">
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TableApproveBeforePB;
