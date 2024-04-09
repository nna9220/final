import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import './styleTable.scss'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DetailsIcon from '@mui/icons-material/Details';
import { Link } from 'react-router-dom';
import ManagementTask from '../KanbanOfHead/ManagementTask';

function TableTopic() {
  const [topics, setTopics] = useState([]);
  const [showManagementTask, setShowManagementTask] = useState(false); 
  const [selectedSubjectId, setSelectedSubjectId] = useState(null); 
  const [selectedSubjectName, setSelectedSubjectName] = useState("");
  const [showBackButton, setShowBackButton] = useState(false);
  const userToken = getTokenFromUrlAndSaveToStorage();

  useEffect(() => {
    console.log("TokenTopic: " + userToken);
    if (userToken) {
      const tokenSt = sessionStorage.getItem(userToken);
      if (!tokenSt) {
        axios.get('http://localhost:5000/api/head/manager', {
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
      <hr/>
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
            </tr>
          </thead>
          <tbody>
            {topics.map((item, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>{item.subjectName}</td>
                <td>{item.instructorId.person.firstName + ' ' + item.instructorId.person.lastName}</td>
                <td>{item.thesisAdvisorId.person.firstName + ' ' + item.thesisAdvisorId.person.lastName}</td>
                <td>{item.student1}</td>
                <td>{item.student2}</td>
                <td>{item.requirement}</td>
                <td>
                  <button
                    style={{ marginRight: '20px' }}
                    className='button-res'
                    onClick={() => handleShowManagementTask(item.subjectId, item.subjectName)} // Truyền tên đề tài vào hàm
                  >
                    <p className='text'><DetailsIcon/></p>
                  </button>
                  <button className='button-res'>
                    <p className='text'><ModeEditOutlineOutlinedIcon/></p>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TableTopic;
