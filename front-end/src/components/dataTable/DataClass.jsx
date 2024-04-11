import React from 'react'
import './DataClass.scss'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getTokenFromUrlAndSaveToStorage } from '../tokenutils';
import axiosInstance from '../../API/axios';

function DataClass() {
    const [classes, setClasses] = useState([])
    const [newClass, setNewClass] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null); // State lưu thông tin năm được chọn để chỉnh sửa


    useEffect(() => {
        const tokenSt = sessionStorage.getItem('userToken');
        console.log("Token SV2: " + tokenSt);
        if (tokenSt) {
            console.log("Test: " + tokenSt);
            axiosInstance.get('/admin/studentClass', {
                headers: {
                    'Authorization': `Bearer ${tokenSt}`,
                },
            })
                .then(response => {
                    console.log("DataTable: ", response.data);
                    const classArray = response.data.listClass || [];
                    setClasses(classArray);
                })
                .catch(error => {
                    console.error("error: ", error);
                });
        } else {
            console.log("Lỗi !!")
        }

    }, []);

    const handleAddClass = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        const newClassValue = document.getElementById('exampleFormControlInput1').value;
    
        axiosInstance.post('/admin/studentClass/create', null, {
            params: {
                className: newClassValue
            },
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
        .then(response => {
            setClasses([...classes, response.data]);
            setNewClass('');
            setShowForm(false);
            console.log("Thêm lớp học thành công");
            
        })
        .catch(error => {
            console.error(error);
            console.log("Lỗi");
        });
    };
    
    const handleEditClass = () => {
        const userToken = getTokenFromUrlAndSaveToStorage();
        const updatedClassValue = document.getElementById('exampleFormControlInput1').value;
    
        axiosInstance.post(`/admin/studentClass/edit/${selectedClass.id}`, null, {
            params: {
                classId: selectedClass.id,
                classname: updatedClassValue
            },
            headers: {
                'Authorization': `Bearer ${userToken}`,
            },
        })
        .then(response => {
            const updatedClass = classes.map(item => {
                if (item.id === selectedClass.id) {
                    return { ...item, classname: updatedClassValue };
                }
                return item;
            });
            setClasses(updatedClass);
            setNewClass('');
            setShowForm(false);
            console.log("Chỉnh sửa Niên khóa thành công");
            
        })
        .catch(error => {
            console.error(error);
            console.log("Lỗi");
        });
    };

    const handleViewClass = (classname) => {
        setSelectedClass(classname); 
        setNewClass(classname.classname); 
        setShowForm(true);
    };

    return (
        <div>
            <button type="button" className="btn btn-success" onClick={() => setShowForm(true)}>
                Add
            </button>
            {showForm && (
                <div className="modal fade show" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{display: 'block'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">{selectedClass ? 'CHỈNH SỬA NĂM HỌC' : 'THÊM LỚP HỌC'}</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowForm(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Tên lớp học</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="exampleFormControlInput1" 
                                        value={newClass} // Sử dụng giá trị của newYear cho input
                                        onChange={(e) => setNewClass(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowForm(false)}>Close</button>
                                {selectedClass ? (
                                    <button type="button" className="btn btn-primary" onClick={handleEditClass}>Update</button>
                                ) : (
                                    <button type="button" className="btn btn-success" onClick={handleAddClass}>Add</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên lớp học</th>
                        <th scope='col'> Action</th>
                    </tr>
                </thead>
                <tbody>
                    {classes.map((item, index) => (
                        <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{item.classname}</td>
                            <td>
                                <button className='btnView' onClick={() => handleViewClass(item)}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DataClass