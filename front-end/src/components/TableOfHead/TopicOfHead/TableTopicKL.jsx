import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import './TableTopic.scss'
import { BsPentagonHalf } from "react-icons/bs";
import { BsPentagonFill } from "react-icons/bs";
import { BsCursorFill } from "react-icons/bs";
import ManagementTask from '../../KanbanOfHead/ManagementTask';
import axiosInstance from '../../../API/axios';

function TableTopicKL() {
  const [topics, setTopics] = useState([]);
  const [showManagementTask, setShowManagementTask] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState("");
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  const [showBackButton, setShowBackButton] = useState(false);
  const userToken = getTokenFromUrlAndSaveToStorage();
  const [scores, setScores] = useState({}); // Sử dụng object để lưu trữ điểm cho mỗi đề tài


  useEffect(() => {
    console.log("TokenTopic: " + userToken);
    if (userToken) {
      const tokenSt = sessionStorage.getItem(userToken);
      if (!tokenSt) {
        axiosInstance.get('/head/graduation/manager', {
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
    setShowSubmitButton(false);
  };

  const handleGoBack = () => {
    setShowManagementTask(false);
    setShowBackButton(false);
    setShowSubmitButton(true);
  };

  const handleScoreChange = (subjectId, event) => {
    const value = parseFloat(event.target.value);
    setScores(prevScores => ({
      ...prevScores,
      [subjectId]: value
    }));
  }

  return (
    <>
      <div className='home-table-assign'>
        {showSubmitButton && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="submit50-all" style={{ marginRight: '10px' }} type="button" data-bs-toggle="modal" data-bs-target="#submit50">
                Nộp báo cáo 50%
              </button>
              <button className="submit100-all" type="button" data-bs-toggle="modal" data-bs-target="#submit100">
                Nộp báo cáo 100%
              </button>
            </div>
          </>
        )}
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
                  <td>{item.instructorId.person?.firstName + ' ' + item.instructorId.person?.lastName}</td>
                  <td>{item.thesisAdvisorId?.person?.firstName + ' ' + item.thesisAdvisorId?.person?.lastName}</td>
                  <td>{item.student1}</td>
                  <td>{item.student2}</td>
                  <td>{item.student3}</td>
                  <td>{item.requirement}</td>
                  <td>
                    <button className="management" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Đi đến chi tiết để quản lý đề tài" onClick={() => handleShowManagementTask(item.subjectId, item.subjectName)}><BsCursorFill /></button>
                    <button className="submit50" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-placement="bottom" title="Yêu cầu nộp báo cáo 50%">
                      <BsPentagonHalf />
                    </button>
                    <button className="submit100" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal1" data-bs-placement="bottom" title="Yêu cầu nộp báo cáo 100%">
                      <BsPentagonFill />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Thông báo</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Yêu cầu nôp báo cáo 50% cho đề tài này?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Confirm</button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Thông báo</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Yêu cầu nôp báo cáo 100% cho đề tài này?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Confirm</button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="submit50" tabindex="-1" aria-labelledby="exampleModalLabel50" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel50">Thông báo</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Yêu cầu nôp báo cáo 50% cho toàn bộ đề tài?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Confirm</button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="submit100" tabindex="-1" aria-labelledby="exampleModalLabel100" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel100">Thông báo</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                Yêu cầu nôp báo cáo 100% cho toàn bộ đề tài?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TableTopicKL