import React, { useState, useEffect } from 'react';
import { getTokenFromUrlAndSaveToStorage } from '../../tokenutils';
import { Toast } from 'react-bootstrap';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axiosInstance from '../../../API/axios';
import './assign.scss'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TableAssign() {
  const [topics, setTopics] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [lecturerIds, setLecturerIds] = useState([]); // Mảng lưu trữ lecturerId cho mỗi đề tài
  const userToken = getTokenFromUrlAndSaveToStorage();
  const [showAssignToast, setShowAssignToast] = useState(false);
  const [showErrorToastAssign, setShowErrorToastAssign] = useState(false);

  useEffect(() => {
    console.log("Token: " + userToken);
    if (userToken) {
      const tokenSt = sessionStorage.getItem(userToken);
      if (!tokenSt) {
        axiosInstance.get('/head/subject/listAdd', {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        })
          .then(response => {
            console.log("Topic: ", response.data);
            setTopics(response.data.listSubject);
            // Khởi tạo mảng lecturerIds với độ dài bằng số lượng đề tài
            setLecturerIds(Array(response.data.listSubject.length).fill(''));
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }, [userToken]);

  const handleSelectChange = (event, index) => {
    const { value } = event.target;
    const newLecturerIds = [...lecturerIds];
    newLecturerIds[index] = value;
    setLecturerIds(newLecturerIds);
  };

  const handleAssignGVPB = (subjectId, index) => {
    axiosInstance.get(`/head/subject/listLecturer/${subjectId}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    })
      .then(response => {
        console.log("List of lecturers for counter argument: ", response.data.listLecturer);
        setLecturers(response.data.listLecturer);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleGVPB = (subjectId, index) => {
    const lecturerId = lecturerIds[index]; // Lấy lecturerId tương ứng với đề tài
    if (lecturerId && subjectId) {
      axiosInstance.post(`/head/subject/addCounterArgumrnt/${subjectId}/${lecturerId}`, null, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      })
        .then(response => {
          console.log('Successfully assigned lecturer for counter argument:', response.data);
          const updatedTopics = topics.map((topic, idx) => {
            if (idx === index) {
              return { ...topic, counterArgumentLecturer: response.data };
            }
            return topic;
          });
          setTopics(updatedTopics);
          toast.success("Phân giảng viên thành công!")
          setShowAssignToast(true);
        })
        .catch(error => {
          console.error('Error assigning lecturer for counter argument:', error);
          setShowErrorToastAssign(true);
          toast.error("Phân giảng viên thất bại!")
        });
    } else {
      console.error('LectureId or subjectId is undefined or empty');
      console.log("LectureId: ", lecturerId);
      console.log("SubjectId: ", subjectId);
    }
  };

  return (
    <div className='home-table-assign'>
      <ToastContainer/>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tên đề tài</th>
            <th scope="col">Sinh viên 1</th>
            <th scope="col">Sinh viên 2</th>
            <th scope="col">Sinh viên 3</th>
            <th scope="col">GVHD</th>
            <th scope="col">Phân GVPB</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((item, index) => (
            <tr key={index}>
              <th scope='row'>{index + 1}</th>
              <td>{item.subjectName}</td>
              <td>{item.student1}</td>
              <td>{item.student2}</td>
              <td>{item.student3}</td>
              <td>{item.instructorId.person.firstName + ' ' + item.instructorId.person.lastName}</td>
              <td>
                <div className='group-assign'>
                  <select className='optionLecs' value={lecturerIds[index]} onChange={(event) => handleSelectChange(event, index)} onClick={() => handleAssignGVPB(item.subjectId, index)}>
                    <option className='option' value="" >Chọn GVPB</option>
                    {lecturers.map((lecturer, idx) => (
                      <option key={idx} value={lecturer.lecturerId}>{lecturer.person.firstName} {lecturer.person.lastName}</option>
                    ))}
                  </select>
                  <button className='btn-assign' onClick={() => handleGVPB(item.subjectId, index)}>Phân công</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableAssign;
