import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TableRegis() {
    const [subjectName, setSubjectName] = useState('');
    const [requirement, setRequirement] = useState('');
    const [expected, setExpected] = useState('');
    const [student1, setStudent1] = useState('');
    const [student2, setStudent2] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            const response = await axios.post(
                'http://localhost:5000/api/head/subject/register',
                {
                    subjectName: subjectName,
                    requirement: requirement,
                    expected: expected,
                    student1: student1,
                    student2: student2
                },
                {
                    headers: {
                        'Authorization': 'YourAuthorizationToken'
                    }
                }
            );
    
            console.log('Response data:', response.data);
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
        } catch (error) {
            console.error('Error:', error);
            
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className='homeRegis'>
            <div className='title'>
                <h3>ĐĂNG KÝ ĐỀ TÀI</h3>
            </div>
            <div className='menuItems'>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className='name'>
                            <label className='lable' htmlFor="">Tên đề tài: </label>
                            <input className='form-control' value={subjectName} onChange={(e) => setSubjectName(e.target.value)}></input>
                        </div>

                        <div className='requiment'>
                            <label className='lable' htmlFor="">Yêu cầu: </label>
                            <input className='form-control' value={requirement} onChange={(e) => setRequirement(e.target.value)}></input>
                        </div>

                        <div className='result'>
                            <label className='lable' htmlFor="">Kết quả mong muốn: </label>
                            <input className='form-control' value={expected} onChange={(e) => setExpected(e.target.value)}></input>
                        </div>

                        <div className='groupStudent'>
                            <label className='groups'>Nhóm sinh viên thực hiện: </label>
                            <div className='student1'>
                                <label className='lable' htmlFor="">Sinh viên 1: </label>
                                <input className='form-control' value={student1} onChange={(e) => setStudent1(e.target.value)}></input>
                            </div>

                            <div className='student2'>
                                <label className='lable' htmlFor="">Sinh viên 2: </label>
                                <input className='form-control' value={student2} onChange={(e) => setStudent2(e.target.value)}></input>
                            </div>
                        </div>

                        <div className='footerForm'>
                            <div>
                                <button type="submit">Đăng ký</button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default TableRegis;
