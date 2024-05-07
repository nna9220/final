import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import './TableTopic.scss'
import DetailsIcon from '@mui/icons-material/Details';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined'; import { Link } from 'react-router-dom';
import ManagementTask from '../../KanbanOfHead/ManagementTask';
import axiosInstance from '../../../API/axios';

function TableTopic() {
  const [topics, setTopics] = useState([]);
  const [showManagementTask, setShowManagementTask] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState("");
  const [showBackButton, setShowBackButton] = useState(false);
  const userToken = getTokenFromUrlAndSaveToStorage();
  const [scores, setScores] = useState({}); // Sử dụng object để lưu trữ điểm cho mỗi đề tài

  useEffect(() => {
    console.log("TokenTopic: " + userToken);
    if (userToken) {
      const tokenSt = sessionStorage.getItem(userToken);
      if (!tokenSt) {
        axiosInstance.get('/head/manager', {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        })
          .then(response => {
            console.log("Topic: ", response.data);
            setTopics(response.data.listSubject);
            // Khởi tạo điểm mặc định cho mỗi đề tài
            const initialScores = {};
            response.data.listSubject.forEach(topic => {
              initialScores[topic.subjectId] = 0;
            });
            setScores(initialScores);
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }, [userToken]);

  const handleShowManagementTask = (subjectId, subjectName) => { // Thêm tham số để nhận tên đề tài
    setSelectedSubjectId(subjectId);
    setSelectedSubjectName(subjectName); // Lưu trữ tên đề tài được chọn
    setShowManagementTask(true);
    setShowBackButton(true);
  };

  const handleGoBack = () => {
    setShowManagementTask(false);
    setShowBackButton(false);
  };

  const handleScoreChange = (subjectId, event) => {
    const value = parseFloat(event.target.value);
    setScores(prevScores => ({
      ...prevScores,
      [subjectId]: value
    }));
  }

  return (
    <div>
      {showBackButton && (
        <>
          <div className='group-lecturer'>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="#" onClick={handleGoBack}>Danh sách đề tài</a></li>
                <li className="breadcrumb-item active" aria-current="page">{selectedSubjectName}</li>
              </ol>
            </nav>
            <button data-bs-toggle="modal" data-bs-target="#confirmSuccess">Hoàn thành đề tài</button>
          </div>
          <div class="modal fade" id="confirmSuccess" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">XÁC NHẬN HOÀN THÀNH ĐỀ TÀI</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  Bạn chắc chắn muốn hoàn thành đề tài này không?
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary">Confirm</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className='home-table-myTopic'>
        {showManagementTask ? (
          <ManagementTask subjectId={selectedSubjectId} />
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col" style={{ width: '300px' }}>Tên đề tài</th>
                <th scope="col">GVHD</th>
                <th scope="col">GVPB</th>
                <th scope="col">Sinh viên 1</th>
                <th scope="col">Sinh viên 2</th>
                <th scope="col">Sinh viên 3</th>
                <th scope="col">Yêu cầu</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((item, index) => (
                <tr key={index}>
                  <th scope='row'>{index + 1}</th>
                  <td>{item.subjectName}</td>
                  <td>{item.instructorId?.person?.firstName + ' ' + item.instructorId?.person?.lastName}</td>
                  <td>{item.thesisAdvisorId?.person?.firstName + ' ' + item.thesisAdvisorId?.person?.lastName}</td>
                  <td>{item.student1}</td>
                  <td>{item.student2}</td>
                  <td>{item.student3}</td>
                  <td>{item.requirement}</td>
                  <td>
                    <button style={{ marginRight: '20px' }} class="btn btn-primary" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Đi đến chi tiết để quản lý đề tài" onClick={() => handleShowManagementTask(item.subjectId, item.subjectName)}><DetailsIcon /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default TableTopic;
