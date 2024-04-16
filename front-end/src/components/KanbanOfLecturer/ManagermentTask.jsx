import React, { useState, useEffect } from 'react';
import Booard from './Booard'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DetailsIcon from '@mui/icons-material/Details';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';

function ManagermentTask() {
  const [topics, setTopics] = useState([]);
  const [activeTLChuyenNganh, setActiveTLChuyenNganh] = useState(false);
  const [activeKhoaLuan, setActiveKhoaLuan] = useState(false);
  const [showManagementTask, setShowManagementTask] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState("");
  const [showBackButton, setShowBackButton] = useState(false);
  const userToken = getTokenFromUrlAndSaveToStorage();

  useEffect(() => {
    listTopic();
  }, [userToken]);

  const listTopic = () => {
    axiosInstance.get('/lecturer/subject', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      }
    })
      .then(response => {
        console.log("TopicTL: ", response.data);
        setTopics(response.data.listSubject);
        setActiveTLChuyenNganh(true);
        setActiveKhoaLuan(false);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const listSubjectGraduation = () => {
    axiosInstance.get('/lecturer/subjectGraduation', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      }
    })
      .then(response => {
        console.log("TopicKL: ", response.data);
        setTopics(response.data.listSubject);
        setActiveKhoaLuan(true);
        setActiveTLChuyenNganh(false);
      })
      .catch(error => {
        console.error(error);
      });
  }
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
      <div className='btn-type'>
        <button className={`button-listDelete ${activeTLChuyenNganh ? 'active' : ''}`} onClick={listTopic}>
          <TopicOutlinedIcon /> Tiểu luận chuyên ngành
        </button>
        <button className={`button-listDelete ${activeKhoaLuan ? 'active' : ''}`} onClick={listSubjectGraduation}>
          <SummarizeOutlinedIcon /> Khóa luận tốt nghiệp
        </button>
      </div>
      {showBackButton && (
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="#" onClick={handleGoBack}>Danh sách đề tài</a></li>
            <li className="breadcrumb-item active" aria-current="page">{selectedSubjectName}</li> {/* Sử dụng tên đề tài được lưu trữ */}
          </ol>
        </nav>
      )}
      {showManagementTask ? (
        <Booard subjectId={selectedSubjectId} />
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
              <th scope="col">Sinh viên 3</th>
              <th scope='col'>Loại đề tài</th>
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
                <td>{item.student1 || ''}</td>
                <td>{item.student2 || ''}</td>
                <td>{item.student3 || ''}</td>
                <td>{item.typeSubject.typeName || ''}</td>
                <td>{item.requirement}</td>
                <td>
                  <button
                    style={{ marginRight: '20px' }}
                    className='button-res'
                    onClick={() => handleShowManagementTask(item.subjectId, item.subjectName)}
                  >
                    <p className='text'><DetailsIcon /></p>
                  </button>
                  <button className='button-res'>
                    <p className='text'><ModeEditOutlineOutlinedIcon /></p>
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

export default ManagermentTask