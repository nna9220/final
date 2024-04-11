import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import './TableTopic.scss'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DetailsIcon from '@mui/icons-material/Details';
import { Link } from 'react-router-dom';
import ManagementTask from '../KanbanOfHead/ManagementTask';
import axiosInstance from '../../API/axios';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

function TableTopicKL() {
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
        axios.get('/api/head/graduation/manager', {
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
    <div className='home-table'>
      {showBackButton && (
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="#" onClick={handleGoBack}>Danh sách đề tài</a></li>
            <li className="breadcrumb-item active" aria-current="page">{selectedSubjectName}</li> {/* Sử dụng tên đề tài được lưu trữ */}
          </ol>
        </nav>
      )}
      {showManagementTask ? (
        <ManagementTask subjectId={selectedSubjectId} />
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên đề tài</th>
              <th scope="col">GVHD</th>
              <th scope="col">GVPB</th>
              <th scope="col">Sinh viên 1</th>
              <th scope="col">Sinh viên 2</th>
              <th scope="col">Yêu cầu</th>
              <th scope="col">Action</th>
              <th scope="col">Chấm điểm</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((item, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>{item.subjectName}</td>
                <td>{item.instructorId.person?.firstName + ' ' + item.instructorId.person?.lastName}</td>
                <td>{item.thesisAdvisorId?.person?.firstName + ' ' + item.thesisAdvisorId?.person?.lastName}</td>
                <td>{item.student1}</td>
                <td>{item.student2}</td>
                <td>{item.requirement}</td>
                <td>
                  <button style={{ marginRight: '20px' }} class="btn btn-primary" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Đi đến chi tiết để quản lý đề tài" onClick={() => handleShowManagementTask(item.subjectId, item.subjectName)}><DetailsIcon /></button>
                </td>
                <td>
                  <div style={{display:'flex',}}>
                    <input type="number" value={scores[item.subjectId]} onChange={(e) => handleScoreChange(item.subjectId, e)} min={0} max={10} step={0.1}/>
                    <button style={{marginLeft:'5px'}} class="btn btn-success" type="button"><CheckCircleOutlineOutlinedIcon/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TableTopicKL