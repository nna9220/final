import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import './styleTable.scss';

function TableAssign() {
  const [topics, setTopics] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [lecturerId, setSelectedLecturerId] = useState(''); // State mới để lưu trữ id của giảng viên được chọn
  const userToken = getTokenFromUrlAndSaveToStorage();

  useEffect(() => {
    console.log("Token: " + userToken);
    if (userToken) {
      const tokenSt = sessionStorage.getItem(userToken);
      if (!tokenSt) {
        axios.get('http://localhost:5000/api/head/subject/listAdd', {
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

  const handleSelectChange = (event) => {
    setSelectedLecturerId(event.target.value); // Cập nhật id của giảng viên được chọn
  };

  const handleAssignGVPB = (subjectId) => {
    axios.get(`http://localhost:5000/api/head/subject/listLecturer/${subjectId}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    })
      .then(response => {
        console.log("List of lecturers for counter argument: ", response.data.listLecturer);
        setLecturers(response.data.listLecturer);
        console.log("LecID: ", lecturerId); // Xóa dòng này
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleGVPB = (subjectId) => { // Loại bỏ lectureId
    if (lecturerId && subjectId) { // Thay lectureId bằng selectedLecturerId
      axios.post(`http://localhost:5000/api/head/subject/addCounterArgumrnt/${subjectId}/${lecturerId}`, null, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      })
        .then(response => {
          console.log('Successfully assigned lecturer for counter argument:', response.data);
          const updatedTopics = topics.map(topic => {
            if (topic.subjectId === subjectId) {
              return { ...topic, counterArgumentLecturer: response.data };
            }
            return topic;
          });
          setTopics(updatedTopics);
        })
        .catch(error => {
          console.error('Error assigning lecturer for counter argument:', error);
        });
    } else {
      console.error('LectureId or subjectId is undefined or empty');
      console.log("LectureId: ", lecturerId); // Thay lectureId bằng selectedLecturerId
      console.log("SubjectId: ", subjectId);
    }
  };


  return (
    <div className='home-table'>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tên đề tài</th>
            <th scope="col">Sinh viên 1</th>
            <th scope="col">Sinh viên 2</th>
            <th scope="col">Giảng viên hướng dẫn</th>
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
              <td>{item.instructorId.person.firstName + ' ' + item.instructorId.person.lastName}</td>
              <td>
                <select className='optionLecs' value={lecturerId} onChange={handleSelectChange} onClick={() => handleAssignGVPB(item.subjectId)}>
                  <option className='option' value="" >Chọn giảng viên phản biện</option>
                  {lecturers.map((lecturer, index) => (
                    <option key={index} value={lecturer.lecturerId}>{lecturer.person.firstName} {lecturer.person.lastName}</option>
                  ))}
                </select>
                <button onClick={() => handleGVPB(item.subjectId, lecturerId)}>Phân công</button> {/* Truyền subjectId và lectureId vào hàm handleGVPB */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableAssign;
